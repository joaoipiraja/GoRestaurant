import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Foods, FormData } from '../../../types'

import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export const Dashboard = () => {
  const [foods, setFoods] = useState<Foods[]>([])
  const [editingFood, setEditingFood] = useState<Foods>({} as Foods)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect( () => {
    const fetchData = async () => {
      try {
        const response = await api.get('/foods');
        setFoods(response.data)
      } catch (error) {
        console.log(error) 
      }
    }

    fetchData()  
  }, []);

  const handleAddFood = async (food: FormData) => {
    try {
      const response = await api.post<Foods>('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateFood = async (food: Foods) => {
    try {
      const foodUpdated = await api.put(
         `/foods/${editingFood.id}`,
         { ...editingFood, ...food },
       );

      const foodsUpdated = foods.map(item =>
        item.id !== foodUpdated.data.id ? item : foodUpdated.data,
      );

      setFoods([...foodsUpdated])
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteFood = async (foodId: number) => {
    await api.delete(`/foods/${foodId}`)

    const foodsFiltered = foods.filter(food => food.id !== foodId);

    setFoods([...foodsFiltered])
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen)
  }

  const handleEditFood = (food: Foods) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}