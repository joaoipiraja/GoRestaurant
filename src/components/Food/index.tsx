import { useState } from 'react';
import { FiEdit3, FiTrash } from 'react-icons/fi';
import { Foods } from '../../../types'
import { Container } from './styles';
import api from '../../services/api';

type FoodProps = {
  food: Foods;
  handleEditFood: (food: Foods) => void;
  handleDelete: (foodId: number) => Promise<void>;
}


export const Food = ({ food, handleEditFood, handleDelete }: FoodProps) => {
  const [isAvailable, setIsAvailable] = useState<boolean>(food.available || true)

  const handleToggleAvailable = async (foodId : number) => {
    await api.put<Foods>(`/foods/${foodId}`, {
      ...food,
      available: !isAvailable,
    })
    
    setIsAvailable(!isAvailable)
  }

  const setEditingFood = (food: Foods) => {
    handleEditFood(food);
  }

  return (
    <Container available={isAvailable}>
      <header>
        <img src={food.image} alt={food.name} />
      </header>
      <section className="body">
        <h2>{food.name}</h2>
        <p>{food.description}</p>
        <p className="price">
          R$ <b>{food.price}</b>
        </p>
      </section>
      <section className="footer">
        <div className="icon-container">
          <button
            type="button"
            className="icon"
            onClick={() => setEditingFood(food)}
            data-testid={`edit-food-${food.id}`}
          >
            <FiEdit3 size={20} />
          </button>

          <button
            type="button"
            className="icon"
            onClick={() => handleDelete(food.id)}
            data-testid={`remove-food-${food.id}`}
          >
            <FiTrash size={20} />
          </button>
        </div>

        <div className="availability-container">
          <p>{isAvailable ? 'Disponível' : 'Indisponível'}</p>

          <label htmlFor={`available-switch-${food.id}`} className="switch">
            <input
              id={`available-switch-${food.id}`}
              type="checkbox"
              checked={isAvailable}
              onChange={() => handleToggleAvailable(food.id)}
              data-testid={`change-status-food-${food.id}`}
            />
            <span className="slider" />
          </label>
        </div>
      </section>
    </Container>
  );
}
