import csv
import os
from typing import List, Dict, Any

class DataManager:
    def __init__(self):
        self.datasets = {
            "food": [],
            "medicine": [],
            "disease": [],
            "herb": [],
            "interaction": []
        }
        self.data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
        self.load_all()

    def load_all(self):
        file_map = {
            "food": "Food Information.csv",
            "medicine": "Drug Information.csv",
            "disease": "Disease Information.csv",
            "herb": "Herb Information.csv",
            "interaction": "Interaction Information.csv"
        }
        
        for key, filename in file_map.items():
            path = os.path.join(self.data_path, filename)
            if os.path.exists(path):
                try:
                    with open(path, mode='r', encoding='utf-8-sig', errors='ignore') as f:
                        reader = csv.DictReader(f)
                        self.datasets[key] = list(reader)
                except Exception as e:
                    print(f"Error loading {filename}: {e}")
            else:
                print(f"Warning: {filename} not found in {self.data_path}")

    def find_matches(self, query: str) -> Dict[str, List[Dict[str, Any]]]:
        """
        Standard entity search (Drugs, Foods, Herbs, Diseases).
        Note: Dietitian mode might ignore the drug matches later, but we keep them for interactions.
        """
        results = {
            "food": [],
            "medicine": [],
            "disease": [],
            "herb": [],
            "interaction": []
        }
        
        q = query.lower().strip()
        if not q or len(q) < 2:
            return results

        # 1. Search Drugs (Usage: Interaction checking ONLY)
        # We need to recognize drugs if the user types "Aspirin" to warn them, even if we don't suggest it.
        for row in self.datasets["medicine"]:
            name = row.get("Drug_Name", "").lower()
            if not name: continue
            if name in q or (len(q) >= 3 and q in name):
                results["medicine"].append(row)
                if len(results["medicine"]) >= 3: break
        
        # 2. Search Foods
        for row in self.datasets["food"]:
            name = row.get("Food_Name", "").lower()
            if not name: continue
            if name in q or (len(q) >= 3 and q in name):
                results["food"].append(row)
                if len(results["food"]) >= 3: break
        
        if len(results["food"]) < 3 and len(q) >= 4:
            for row in self.datasets["food"]:
                if row in results["food"]: continue
                desc = row.get("Description", "").lower()
                if q in desc:
                    results["food"].append(row)
                    if len(results["food"]) >= 3: break

        # 3. Search Herbs
        for row in self.datasets["herb"]:
            ename = row.get("Herb_English_Name", "").lower()
            if not ename: continue
            if ename in q or (len(q) >= 3 and q in ename):
                results["herb"].append(row)
                if len(results["herb"]) >= 3: break
        
        if len(results["herb"]) < 3 and len(q) >= 4:
            for row in self.datasets["herb"]:
                if row in results["herb"]: continue
                func = row.get("Function", "").lower()
                ind = row.get("Indication", "").lower()
                if q in func or q in ind:
                    results["herb"].append(row)
                    if len(results["herb"]) >= 3: break

        # 4. Search Diseases
        for row in self.datasets["disease"]:
            ind = row.get("Indication", "").lower()
            if not ind: continue
            if ind in q or (len(q) >= 3 and q in ind):
                results["disease"].append(row)
                if len(results["disease"]) >= 3: break

        return results

    def find_natural_remedies(self, condition: str) -> Dict[str, List[Dict[str, Any]]]:
        """
        Reverse lookup: Finds Foods and Herbs that mention the condition in their descriptions/functions.
        """
        remedies = {"food": [], "herb": []}
        q = condition.lower().strip()
        if len(q) < 3: return remedies

        # Foods for condition
        for row in self.datasets["food"]:
            desc = row.get("Description", "").lower()
            if q in desc:
                remedies["food"].append(row)
                if len(remedies["food"]) >= 3: break

        # Herbs for condition
        for row in self.datasets["herb"]:
            ind = row.get("Indication", "").lower()
            func = row.get("Function", "").lower()
            if q in ind or q in func:
                remedies["herb"].append(row)
                if len(remedies["herb"]) >= 3: break
        
        return remedies

    def get_interaction_specific(self, drug_names: List[str], item_names: List[str]) -> List[Dict[str, Any]]:
        found = []
        for row in self.datasets["interaction"]:
            i_drug = row.get("Drug_Name", "").lower()
            i_item = row.get("Food_Herb_Name", "").lower()
            
            match_drug = False
            for d in drug_names:
                if d and d.lower() in i_drug:
                    match_drug = True
                    break
            if not match_drug: continue

            match_item = False
            for i in item_names:
                if i and i.lower() in i_item:
                    match_item = True
                    break
            
            if match_item:
                found.append(row)
                if len(found) >= 5: break
        
        return found

data_manager = DataManager()
