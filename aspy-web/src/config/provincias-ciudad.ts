export const provincias = [
  { label: "Azuay", value: 1 },
  { label: "Bolívar", value: 2 },
  { label: "Cañar", value: 3 },
  { label: "Carchi", value: 4 },
  { label: "Chimborazo", value: 5 },
  { label: "Cotopaxi", value: 6 },
  { label: "El Oro", value: 7 },
  { label: "Esmeraldas", value: 8 },
  { label: "Galápagos", value: 9 },
  { label: "Guayas", value: 10 },
  { label: "Imbabura", value: 11 },
  { label: "Loja", value: 12 },
  { label: "Los Ríos", value: 13 },
  { label: "Manabí", value: 14 },
  { label: "Morona Santiago", value: 15 },
  { label: "Napo", value: 16 },
  { label: "Orellana", value: 17 },
  { label: "Pastaza", value: 18 },
  { label: "Pichincha", value: 19 },
  { label: "Santa Elena", value: 20 },
  { label: "Santo Domingo de los Tsáchilas", value: 21 },
  { label: "Sucumbíos", value: 22 },
  { label: "Tungurahua", value: 23 },
  { label: "Zamora Chinchipe", value: 24 },
];

type CityOption = { label: string; value: number };

export const ciudadesPorProvincia: { [key: number]: CityOption[] } = {
  // Azuay
  1: [
    { label: "Cuenca", value: 1 },
    { label: "Girón", value: 2 },
    { label: "Gualaceo", value: 3 },
    { label: "Nabón", value: 4 },
    { label: "Paute", value: 5 },
    { label: "Pucará", value: 6 },
    { label: "San Fernando", value: 7 },
    { label: "Santa Isabel", value: 8 },
    { label: "Sigsig", value: 9 },
    { label: "Oña", value: 10 },
    { label: "Chordeleg", value: 11 },
    { label: "El Pan", value: 12 },
    { label: "Sevilla de Oro", value: 13 },
    { label: "Guachapala", value: 14 },
    { label: "Camilo Ponce Enríquez", value: 15 },
  ],

  // Bolívar
  2: [
    { label: "Guaranda", value: 1 },
    { label: "Chillanes", value: 2 },
    { label: "Chimbo", value: 3 },
    { label: "Echeandía", value: 4 },
    { label: "San Miguel", value: 5 },
    { label: "Caluma", value: 6 },
    { label: "Las Naves", value: 7 },
  ],

  // Cañar
  3: [
    { label: "Azogues", value: 1 },
    { label: "Biblián", value: 2 },
    { label: "Cañar", value: 3 },
    { label: "La Troncal", value: 4 },
    { label: "El Tambo", value: 5 },
    { label: "Déleg", value: 6 },
    { label: "Suscal", value: 7 },
  ],

  // Carchi
  4: [
    { label: "Tulcán", value: 1 },
    { label: "Bolívar", value: 2 },
    { label: "Espejo", value: 3 },
    { label: "Mira", value: 4 },
    { label: "Montúfar", value: 5 },
    { label: "San Pedro de Huaca", value: 6 },
  ],

  // Chimborazo
  5: [
    { label: "Riobamba", value: 1 },
    { label: "Alausí", value: 2 },
    { label: "Colta", value: 3 },
    { label: "Chambo", value: 4 },
    { label: "Chunchi", value: 5 },
    { label: "Guamote", value: 6 },
    { label: "Guano", value: 7 },
    { label: "Pallatanga", value: 8 },
    { label: "Penipe", value: 9 },
    { label: "Cumandá", value: 10 },
  ],

  // Cotopaxi
  6: [
    { label: "Latacunga", value: 1 },
    { label: "La Maná", value: 2 },
    { label: "Pangua", value: 3 },
    { label: "Pujilí", value: 4 },
    { label: "Salcedo", value: 5 },
    { label: "Saquisilí", value: 6 },
    { label: "Sigchos", value: 7 },
  ],

  // El Oro
  7: [
    { label: "Machala", value: 1 },
    { label: "Arenillas", value: 2 },
    { label: "Atahualpa", value: 3 },
    { label: "Balsas", value: 4 },
    { label: "Chilla", value: 5 },
    { label: "El Guabo", value: 6 },
    { label: "Huaquillas", value: 7 },
    { label: "Marcabelí", value: 8 },
    { label: "Pasaje", value: 9 },
    { label: "Piñas", value: 10 },
    { label: "Portovelo", value: 11 },
    { label: "Santa Rosa", value: 12 },
    { label: "Zaruma", value: 13 },
    { label: "Las Lajas", value: 14 },
  ],

  // Esmeraldas
  8: [
    { label: "Esmeraldas", value: 1 },
    { label: "Eloy Alfaro", value: 2 },
    { label: "Muisne", value: 3 },
    { label: "Quinindé", value: 4 },
    { label: "San Lorenzo", value: 5 },
    { label: "Atacames", value: 6 },
    { label: "Rioverde", value: 7 },
    { label: "La Tola", value: 8 },
  ],

  // Galápagos
  9: [
    { label: "Puerto Baquerizo Moreno", value: 1 },
    { label: "Puerto Ayora", value: 2 },
    { label: "Puerto Villamil", value: 3 },
  ],

  // Guayas
  10: [
    { label: "Guayaquil", value: 1 },
    { label: "Alfredo Baquerizo Moreno", value: 2 },
    { label: "Balao", value: 3 },
    { label: "Balzar", value: 4 },
    { label: "Colimes", value: 5 },
    { label: "Daule", value: 6 },
    { label: "Durán", value: 7 },
    { label: "El Empalme", value: 8 },
    { label: "El Triunfo", value: 9 },
    { label: "Milagro", value: 10 },
    { label: "Naranjal", value: 11 },
    { label: "Naranjito", value: 12 },
    { label: "Palestina", value: 13 },
    { label: "Pedro Carbo", value: 14 },
    { label: "Samborondón", value: 15 },
    { label: "Santa Lucía", value: 16 },
    { label: "Salitre", value: 17 },
    { label: "Yaguachi", value: 18 },
    { label: "Playas", value: 19 },
    { label: "Simón Bolívar", value: 20 },
    { label: "Coronel Marcelino Maridueña", value: 21 },
    { label: "Lomas de Sargentillo", value: 22 },
    { label: "Nobol", value: 23 },
    { label: "General Antonio Elizalde", value: 24 },
    { label: "Isidro Ayora", value: 25 },
  ],

  // Imbabura
  11: [
    { label: "Ibarra", value: 1 },
    { label: "Antonio Ante", value: 2 },
    { label: "Cotacachi", value: 3 },
    { label: "Otavalo", value: 4 },
    { label: "Pimampiro", value: 5 },
    { label: "San Miguel de Urcuquí", value: 6 },
  ],

  // Loja
  12: [
    { label: "Loja", value: 1 },
    { label: "Calvas", value: 2 },
    { label: "Catamayo", value: 3 },
    { label: "Celica", value: 4 },
    { label: "Chaguarpamba", value: 5 },
    { label: "Espíndola", value: 6 },
    { label: "Gonzanamá", value: 7 },
    { label: "Macará", value: 8 },
    { label: "Paltas", value: 9 },
    { label: "Puyango", value: 10 },
    { label: "Saraguro", value: 11 },
    { label: "Sozoranga", value: 12 },
    { label: "Zapotillo", value: 13 },
    { label: "Pindal", value: 14 },
    { label: "Quilanga", value: 15 },
    { label: "Olmedo", value: 16 },
  ],

  // Los Ríos
  13: [
    { label: "Babahoyo", value: 1 },
    { label: "Baba", value: 2 },
    { label: "Montalvo", value: 3 },
    { label: "Puebloviejo", value: 4 },
    { label: "Quevedo", value: 5 },
    { label: "Urdaneta", value: 6 },
    { label: "Ventanas", value: 7 },
    { label: "Vínces", value: 8 },
    { label: "Palenque", value: 9 },
    { label: "Buena Fe", value: 10 },
    { label: "Valencia", value: 11 },
    { label: "Mocache", value: 12 },
    { label: "Quinsaloma", value: 13 },
  ],

  // Manabí
  14: [
    { label: "Portoviejo", value: 1 },
    { label: "Bolívar", value: 2 },
    { label: "Chone", value: 3 },
    { label: "El Carmen", value: 4 },
    { label: "Flavio Alfaro", value: 5 },
    { label: "Jipijapa", value: 6 },
    { label: "Junín", value: 7 },
    { label: "Manta", value: 8 },
    { label: "Montecristi", value: 9 },
    { label: "Paján", value: 10 },
    { label: "Pichincha", value: 11 },
    { label: "Rocafuerte", value: 12 },
    { label: "Santa Ana", value: 13 },
    { label: "Sucre", value: 14 },
    { label: "Tosagua", value: 15 },
    { label: "24 de Mayo", value: 16 },
    { label: "Pedernales", value: 17 },
    { label: "Olmedo", value: 18 },
    { label: "Puerto López", value: 19 },
    { label: "Jama", value: 20 },
    { label: "Jaramijó", value: 21 },
    { label: "San Vicente", value: 22 },
  ],

  // Morona Santiago
  15: [
    { label: "Macas", value: 1 },
    { label: "Gualaquiza", value: 2 },
    { label: "Limón Indanza", value: 3 },
    { label: "Palora", value: 4 },
    { label: "Santiago", value: 5 },
    { label: "Sucúa", value: 6 },
    { label: "Huamboya", value: 7 },
    { label: "San Juan Bosco", value: 8 },
    { label: "Taisha", value: 9 },
    { label: "Logroño", value: 10 },
    { label: "Pablo Sexto", value: 11 },
    { label: "Tiwintza", value: 12 },
  ],

  // Napo
  16: [
    { label: "Tena", value: 1 },
    { label: "Archidona", value: 2 },
    { label: "El Chaco", value: 3 },
    { label: "Quijos", value: 4 },
    { label: "Carlos Julio Arosemena Tola", value: 5 },
  ],

  // Orellana
  17: [
    { label: "Francisco de Orellana", value: 1 },
    { label: "Aguarico", value: 2 },
    { label: "La Joya de los Sachas", value: 3 },
    { label: "Loreto", value: 4 },
  ],

  // Pastaza
  18: [
    { label: "Puyo", value: 1 },
    { label: "Arajuno", value: 2 },
    { label: "Mera", value: 3 },
    { label: "Santa Clara", value: 4 },
  ],

  // Pichincha
  19: [
    { label: "Quito", value: 1 },
    { label: "Cayambe", value: 2 },
    { label: "Mejía", value: 3 },
    { label: "Pedro Moncayo", value: 4 },
    { label: "Rumiñahui", value: 5 },
    { label: "San Miguel de Los Bancos", value: 6 },
    { label: "Pedro Vicente Maldonado", value: 7 },
    { label: "Puerto Quito", value: 8 },
  ],

  // Santa Elena
  20: [
    { label: "Santa Elena", value: 1 },
    { label: "La Libertad", value: 2 },
    { label: "Salinas", value: 3 },
  ],

  // Santo Domingo de los Tsáchilas
  21: [
    { label: "Santo Domingo", value: 1 },
    { label: "La Concordia", value: 2 },
  ],

  // Sucumbíos
  22: [
    { label: "Nueva Loja", value: 1 },
    { label: "Gonzalo Pizarro", value: 2 },
    { label: "Putumayo", value: 3 },
    { label: "Shushufindi", value: 4 },
    { label: "Sucumbíos", value: 5 },
    { label: "Cascales", value: 6 },
    { label: "Cuyabeno", value: 7 },
  ],

  // Tungurahua
  23: [
    { label: "Ambato", value: 1 },
    { label: "Baños de Agua Santa", value: 2 },
    { label: "Cevallos", value: 3 },
    { label: "Mocha", value: 4 },
    { label: "Patate", value: 5 },
    { label: "Quero", value: 6 },
    { label: "San Pedro de Pelileo", value: 7 },
    { label: "Santiago de Píllaro", value: 8 },
    { label: "Tisaleo", value: 9 },
  ],

  // Zamora Chinchipe
  24: [
    { label: "Zamora", value: 1 },
    { label: "Chinchipe", value: 2 },
    { label: "Nangaritza", value: 3 },
    { label: "Yacuambi", value: 4 },
    { label: "Yantzaza", value: 5 },
    { label: "El Pangui", value: 6 },
    { label: "Centinela del Cóndor", value: 7 },
    { label: "Palanda", value: 8 },
    { label: "Paquisha", value: 9 },
  ],
};
