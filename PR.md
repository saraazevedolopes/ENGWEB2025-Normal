# Persistência de dados
Para garantir a persistência de dados, foi utilizada uma base de dados MongoDB.  
Foram realizadas as seguintes alterações ao dataset original usando o ficheiro `corrigir_dataset.py`:
- Substitui "id" da edição por "_id" (requisito de MongoDB);
- Converte "anoEdição" para inteiro;
- Corrige "organizacao" para "organização" (acentuação correta);
- Garante presença do campo "vencedor" — se estiver ausente, coloca null;
- Em cada música:
  - Garante todos os campos: "id", "título", "país", "compositor", "intérprete", "letra", "link";
  - Insere null em campos ausentes;
  - Gera um id único no formato: 
    - "mYYYY_Pais" se só existir uma música por país; 
    - "mYYYY_Pais_1", "mYYYY_Pais_2" se houver várias.
- Garante que o output é um array de objetos, pronto para mongoimport.

# Setup de bases de dados

```bash
docker start mongoEW
docker cp out.json mongoEW:/tmp
docker exec mongoEW mongoimport -d eurovisao -c edicoes /tmp/out.json --jsonArray
docker exec -it mongoEW sh
mongosh
use eurovisao
show collections
```
A importação utilizou o ficheiro `out.json`, gerado a partir do original com os comandos descritos na secção seguinte.

# Instruções de como executar as aplicações desenvolvidas
### Execução da Api (`porta 25000`)

```bash
cd ex1
npm i
npm start
```

### Execução da Interface Web (`porta 25001`)

```bash
cd ex2
npm i
npm start
```

Abrir no browser:

- API: `http://localhost:25000/edicoes`
- Interface Web: `http://localhost:25001`

# Testes à API
✅ Testes de sucesso

1. Listar todas as edições
```bash
curl -i http://localhost:25000/edicoes
```

2. Listar edições por organização
```bash
curl -i "http://localhost:25000/edicoes?org=Germany"
```

3. Obter edição por ID existente
```bash
curl -i http://localhost:25000/edicoes/ed1956
```

4. Listar países organizadores
```bash
curl -i "http://localhost:25000/edicoes/paises?papel=org"
```

5. Listar países vencedores
```bash
curl -i "http://localhost:25000/edicoes/paises?papel=venc"
```

6. Listar intérpretes
```bash
curl -i http://localhost:25000/edicoes/interpretes
```

⚠️ Testes de Erro

7. Obter edição por ID inexistente (deve dar 404)
```bash
curl -i http://localhost:25000/edicoes/ed9999
```
8. Filtro por organização inexistente (deve dar 404)
```bash
curl -i "http://localhost:25000/edicoes?org=Atlantida"
```

9. Parâmetro inválido no /paises (deve dar 400)
```bash
curl -i "http://localhost:25000/edicoes/paises?papel=xyz"
```

10. Criar edição inválida (deve dar 500 por validação)
(aqui supõe-se que anoEdição seja obrigatório)
```bash
curl -i -X POST -H "Content-Type: application/json" \
-d '{"_id": "edTest", "organização": "Portugal"}' \
http://localhost:25000/edicoes
```

📝 Testes adicionais (criação, atualização e remoção)

11. Criar edição válida
```bash
curl -i -X POST -H "Content-Type: application/json" \
-d '{"_id":"edTeste2025","anoEdição":2025,"organização":"Portugal","vencedor":"Spain","musicas":[]}' \
http://localhost:25000/edicoes
```

12. Atualizar edição existente
```bash
curl -i -X PUT -H "Content-Type: application/json" \
-d '{"vencedor":"Italy"}' \
http://localhost:25000/edicoes/edTeste2025
```

13. Atualizar edição inexistente (404)
```bash
curl -i -X PUT -H "Content-Type: application/json" \
-d '{"vencedor":"Italy"}' \
http://localhost:25000/edicoes/edNaoExiste
```

14. Remover edição existente
```bash
curl -i -X DELETE http://localhost:25000/edicoes/edTeste2025
```

15. Remover edição inexistente (404)
```bash
curl -i -X DELETE http://localhost:25000/edicoes/edNaoExiste
```

# Queries
Também estou presentes em ex1/queries.txt

1. Total de registos na base de dados (número de edições)
```bash
db.edicoes.countDocuments()
```

2. Quantas edições têm "Ireland" como vencedor?
```bash
db.edicoes.countDocuments({ vencedor: "Ireland" })
```

3. Lista de intérpretes (ordenada alfabeticamente, sem repetições)
```bash
db.edicoes.aggregate([
  { $unwind: "$musicas" },
  { $group: { _id: "$musicas.intérprete" } },
  { $sort: { _id: 1 } }
])
```

4. Distribuição de músicas por edição (quantas músicas há em cada edição)
```bash
db.edicoes.aggregate([
  {
    $project: {
      _id: 1,
      anoEdição: 1,
      totalMusicas: { $size: "$musicas" }
    }
  },
  { $sort: { anoEdição: 1 } }
])
```

5. Distribuição de vitórias por país (quantas vitórias tem cada país)
```bash
db.edicoes.aggregate([
  { $match: { vencedor: { $ne: null } } },
  { $group: { _id: "$vencedor", total: { $sum: 1 } } },
  { $sort: { total: -1, _id: 1 } }
])
```