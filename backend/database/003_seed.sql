-- =============================================================================
-- SEEDS INICIAIS (opcional)
-- Produtos padrão para ambiente de desenvolvimento/demo.
-- =============================================================================

INSERT INTO public.products (id, name, description, image, price, category)
VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'PC Gamer Nicetech Pro',
    'Ryzen 5 5600X, RTX 3060, 16GB RAM, SSD 512GB. Pronto para jogar em alta qualidade.',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop',
    'Sob consulta',
    'gamer'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'PC Gamer Elite',
    'Intel i7-13700K, RTX 4070, 32GB DDR5, SSD 1TB NVMe. Performance máxima.',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=400&fit=crop',
    'Sob consulta',
    'gamer'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'Smartphone Premium',
    'Tela AMOLED 6.5", 128GB, câmera tripla. Design moderno e bateria de longa duração.',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop',
    'Sob consulta',
    'smartphone'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'PlayStation 5',
    'Console Sony PS5. Experiência de jogo em 4K com ray tracing e SSD ultrarrápido.',
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop',
    'Sob consulta',
    'games'
  )
ON CONFLICT (id) DO NOTHING;
