const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

var TREE = [];
var TEST_CASE = [
  [1, 4, 5],
  [2, 5, 6],
  [3, 6, 7],
  [4],
  [5, 8, 9],
  [6, 9, 10],
  [7, 10],
  [8, 11],
  [9, 11, 12],
  [10, 12, 13],
  [11],
  [12],
  [13],
];
var ALL_ANCESTORS = [];
var ALL_DECENCY = [];

function buildTree() {
  readline.question(`Ingrese el nombre del nodo: `, (name) => {
    let node = [];
    node.push(parseInt(name));
    readline.question(
      `Ingrese los hijos del nodo ${name} separados por coma. Ej. 2,5,6: `,
      (childs) => {
        const node_childs = childs.trim().split(",");
        node_childs.forEach((child) => node.push(parseInt(child)));
        console.log("Nodo ingresado: ", node);
        TREE.push(node);
        console.log("Arbol: ", TREE);
        readline.question(`Desea agregar mas nodos? [Y | N]: `, (res) => {
          if (res === "N") {
            interactivePrompt();
          } else {
            buildTree();
          }
        });
      }
    );
  });
}

function getParents(nodeNumber) {
  // Devuelve los padres de un nodo dado.
  let parents = [];
  TREE.forEach((node) => {
    if (node.includes(nodeNumber) && node[0] != nodeNumber)
      parents.push(node[0]);
  });
  return parents;
}

function getChilds(nodeNumber) {
  // Devuelve los hijos de un nodo dado
  let childs = [];
  TREE.forEach((node) => {
    if (node[0] == nodeNumber) {
      childs = node;
    }
  });

  if (childs.length) {
    childs.shift();
  }

  return childs;
}

function getAllAncestors(nodeNumber) {
  let index = 0;
  // Obtenemos los padres del nodo dado
  const parents = getParents(nodeNumber);

  if (parents.length) {
    // Agregamos los padres al array de ancestros
    ALL_ANCESTORS = [...ALL_ANCESTORS, ...parents];
    while (index <= ALL_ANCESTORS.length) {
      // Buscamos los padres de cada uno de los ancestros del array.
      // En esta misma linea tambien agregamos los padres encontrados al array de ancestros
      ALL_ANCESTORS = [...ALL_ANCESTORS, ...getParents(ALL_ANCESTORS[index])];
      index = index + 1;
    }
  }
  // Podrian haber algunos elementos duplicados por lo tanto los eliminamos
  ALL_ANCESTORS = removeDuplicates(ALL_ANCESTORS);
  return ALL_ANCESTORS;
}

function getDecency(nodeNumber) {
  let index = 0;
  // Obtenemos los hijos del nodo dado
  const childs = getChilds(nodeNumber);

  if (childs.length) {
    ALL_DECENCY = [...ALL_DECENCY, ...childs];
    while (index <= ALL_DECENCY.length) {
      ALL_DECENCY = [...ALL_DECENCY, ...getChilds(ALL_DECENCY[index])];
      index = index + 1;
    }
  }
  ALL_DECENCY = removeDuplicates(ALL_DECENCY);
  return ALL_DECENCY;
}

function removeDuplicates(array) {
  return array.filter((a, b) => array.indexOf(a) === b);
}

function interactivePrompt() {
  let node_id;
  let option;

  readline.question(
    "\n 1: Buscar ancestros \n 2: Buscar hijos \n 3: Buscar descendencia \n Ingrese una opción: ",
    (res) => {
      option = res;
      readline.question("\n Ingrese el número de nodo: ", (res) => {
        node_id = parseInt(res);
        resolveOption(option, node_id);
        readline.question("Desea seguir operando? [Y | N]: ", (res) => {
          if (res === "Y") {
            ALL_ANCESTORS = [];
            ALL_DECENCY = [];
            interactivePrompt();
          } else {
            readline.close();
          }
        });
      });
    }
  );
}

function resolveOption(option, node_id) {
  if (option === "1") {
    const ancesesters = getAllAncestors(node_id);
    console.log(`Los ancestros de ${node_id} son: ${ancesesters}`);
  }
  if (option === "2") {
    const childs = getChilds(node_id);
    console.log(`Los hijos de ${node_id} son: ${childs}`);
  }
  if (option === "3") {
    const decency = getDecency(node_id);
    console.log(`La descendencia de ${node_id} es: ${decency}`);
  }
}

function main() {
  readline.question(
    "Desea ingresar un nuevo árbol o utilizar los datos prueba? \n [1: Nuevo arbol, 2: Datos de prueba]: ",
    (res) => {
      if (res === "1") {
        buildTree();
        interactivePrompt();
      } else {
        TREE = TEST_CASE;
        interactivePrompt();
      }
    }
  );
}

main();
