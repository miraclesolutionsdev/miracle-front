import LuxuryStore from './luxury/Store'
import FitnessStore from './fitness/Store'
import MinimalStore from './minimal/Store'
import FoodStore from './food/Store'
import ModernStore from './modern/Store'

import LuxuryLanding from './luxury/Landing'
import FitnessLanding from './fitness/Landing'
import MinimalLanding from './minimal/Landing'
import FoodLanding from './food/Landing'
import ModernLanding from './modern/Landing'

const STORES = {
  luxury: LuxuryStore,
  fitness: FitnessStore,
  minimal: MinimalStore,
  food: FoodStore,
  modern: ModernStore,
}

const LANDINGS = {
  luxury: LuxuryLanding,
  fitness: FitnessLanding,
  minimal: MinimalLanding,
  food: FoodLanding,
  modern: ModernLanding,
}

export function getStoreTemplate(name) {
  return STORES[name] || STORES.luxury
}

export function getLandingTemplate(name) {
  return LANDINGS[name] || LANDINGS.luxury
}

export const TEMPLATE_LIST = [
  { id: 'luxury', nombre: 'Luxury', descripcion: 'Elegante y editorial — ideal para moda, joyería, marcas premium', preview: '👗' },
  { id: 'fitness', nombre: 'Fitness', descripcion: 'Oscuro y agresivo — ideal para suplementos, gym, deportes', preview: '💪' },
  { id: 'minimal', nombre: 'Minimal', descripcion: 'Limpio y sofisticado — ideal para tecnología, diseño, arte', preview: '✨' },
  { id: 'food', nombre: 'Food', descripcion: 'Cálido y apetitoso — ideal para restaurantes, delivery, comida', preview: '🍕' },
  { id: 'modern', nombre: 'Modern', descripcion: 'Versátil y funcional — ideal para cualquier tipo de negocio', preview: '🛍️' },
]
