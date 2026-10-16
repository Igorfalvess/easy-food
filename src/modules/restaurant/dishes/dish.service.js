// src/modules/restaurant/dishes/dish.service.js

async function createDish(restaurantId, dishData, file) {
  // Aqui simulamos/realizamos a persistência do prato e da imagem original
  // Na arquitetura FaaS, o arquivo original vai para o Storage (ex: S3) e dispara um evento
  
  const { name, description, price } = dishData;

  console.log(`[EasyFood API] Prato '${name}' recebido para o restaurante ${restaurantId}.`);
  if (file) {
    console.log(`[EasyFood API] Imagem original recebida: ${file.originalname} (${file.size} bytes). Encaminhando para storage...`);
  }

  // Simulação de retorno do prato criado no banco de dados
  const newDish = {
    id: Date.now().toString(),
    restaurantId,
    name,
    description,
    price: Number(price),
    imageUrl: file ? `/uploads/original_${file.originalname}` : null,
    status: "PROCESSING_IMAGE" // Indica que a imagem foi salva e está indo para o FaaS de otimização
  };

  return newDish;
}

module.exports = {
  createDish
};