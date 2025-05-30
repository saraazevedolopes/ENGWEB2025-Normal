import json

def corrigir_dataset():
    with open("dataset.json", 'r', encoding='utf-8') as f:
        dados = json.load(f)

    dados_corrigidos = []

    for edicao_id, edicao in dados.items():
        nova_edicao = {}

        # Substituir "id" por "_id"
        nova_edicao["_id"] = edicao_id

        # Converter anoEdição para inteiro
        try:
            nova_edicao["anoEdição"] = int(edicao.get("anoEdição", 0))
        except ValueError:
            nova_edicao["anoEdição"] = 0

        # Corrigir "organizacao" → "organização"
        nova_edicao["organização"] = edicao.get("organizacao") or edicao.get("organização") or None

        # Garantir existência de "vencedor"
        nova_edicao["vencedor"] = edicao.get("vencedor", None)

        # Corrigir músicas
        musicas = edicao.get("musicas", [])
        musicas_corrigidas = []

        contador_paises = {}
        for m in musicas:
            pais = m.get("país") or m.get("pais") or "Desconhecido"
            contador_paises[pais] = contador_paises.get(pais, 0) + 1
            count = contador_paises[pais]

            base_id = f"m{nova_edicao['anoEdição']}_{pais}"
            musica_id = base_id if count == 1 else f"{base_id}_{count}"

            musica_corrigida = {
                "id": musica_id,
                "título": m.get("título") or m.get("titulo") or None,
                "país": pais,
                "compositor": m.get("compositor", None),
                "intérprete": m.get("intérprete") or m.get("interprete") or None,
                "letra": m.get("letra", None),
                "link": m.get("link", None)
            }

            musicas_corrigidas.append(musica_corrigida)

        nova_edicao["musicas"] = musicas_corrigidas
        dados_corrigidos.append(nova_edicao)

    # Guardar no ficheiro de saída
    with open("out.json", 'w', encoding='utf-8') as f:
        json.dump(dados_corrigidos, f, ensure_ascii=False, indent=2)

    print("✔ Correções aplicadas com sucesso. Ficheiro gerado: out.json")

# Executar
if __name__ == "__main__":
    corrigir_dataset()
