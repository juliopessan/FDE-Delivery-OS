import os
import shutil
import sys
import json
import argparse
from datetime import datetime

def init_project(project_name, domain="custom"):
    # Ensure we are running from root or adjust paths
    base_path = os.getcwd()
    harness_dir = os.path.join(base_path, "harness/engagements")
    template_dir = os.path.join(base_path, "harness/engagement-template")
    
    if not os.path.exists(harness_dir):
        os.makedirs(harness_dir)
    
    project_path = os.path.join(harness_dir, project_name)
    
    if os.path.exists(project_path):
        print(f"Erro: O projeto '{project_name}' já existe em {project_path}")
        return
    
    print(f"Inicializando projeto: {project_name} (Domínio: {domain})")
    
    # Copy template
    try:
        shutil.copytree(template_dir, project_path)
    except Exception as e:
        print(f"Erro ao copiar template: {e}")
        return
    
    # Customize state.md
    state_file = os.path.join(project_path, "state.md")
    if os.path.exists(state_file):
        with open(state_file, "r", encoding="utf-8") as f:
            content = f.read()
        
        content = content.replace("<Nome do Cliente>", project_name)
        content = content.replace("<slug-do-cliente>", project_name.lower().replace(" ", "-"))
        content = content.replace("Data de início (Fase 0): ______________________", f"Data de início (Fase 0): {datetime.now().strftime('%Y-%m-%d')}")
        
        with open(state_file, "w", encoding="utf-8") as f:
            f.write(content)

    print(f"Sucesso: Projeto '{project_name}' criado.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Inicializa um novo projeto FDE.")
    parser.add_argument("command", choices=["init"], help="Comando a executar")
    parser.add_argument("--name", required=True, help="Nome do projeto/cliente")
    parser.add_argument("--domain", default="custom", help="Domínio do projeto")
    
    args = parser.parse_args()
    
    if args.command == "init":
        init_project(args.name, args.domain)
