export const fetchProducts = async () => {
  // Временные данные для тестирования
  return [
    {
      id: 1,
      title: 'Кожаный портфель',
      description: 'Классический портфель из итальянской кожи',
      price: 45000,
      image: '/images/1.jpg'
    },
    {
      id: 2,
      title: 'Сумка Мессенджер',
      description: 'Стильная сумка через плечо из натуральной кожи',
      price: 28000,
      image: '/images/2.jpg'
    },
    {
      id: 3,
      title: 'Дорожная сумка',
      description: 'Вместительная дорожная сумка из премиальной кожи',
      price: 52000,
      image: '/images/3.jpg'
    }
  ];
}; 