import { useState } from 'react';
import { getData } from './constants/db'
import './App.css'
import Card from './components/card/card';
import Cart from './components/cart/cart';
import { useEffect ,useCallback} from 'react';
const courses = getData();

const telegram = window.Telegram.WebApp

const App = () => {
  const [cartItems,setCartItems] = useState([]);
	useEffect(() => {
		telegram.ready()
	})
  const onAddItem = item => {
		const existItem = cartItems.find(c => c.id == item.id);

		if (existItem) {
			const newData = cartItems.map(c =>
				c.id == item.id
					? { ...existItem, quantity: existItem.quantity + 1 }
					: c
			);
			setCartItems(newData);
		} else {
			const newData = [...cartItems, { ...item, quantity: 1 }];
			setCartItems(newData);
		}
	};

  const onRemoveItem = item => {
		const existItem = cartItems.find(c => c.id == item.id);

		if (existItem.quantity === 1) {
			const newData = cartItems.filter(c => c.id !== existItem.id);
			setCartItems(newData);
		} else {
			const newData = cartItems.map(c =>
				c.id === existItem.id
					? { ...existItem, quantity: existItem.quantity - 1 }
					: c
			);
			setCartItems(newData);
		}
	};

	const onCheckout = () => {
		telegram.MainButton.text = 'Sotib olish :)';
		telegram.MainButton.show()
	}
	const onSendData = useCallback(() => {
		const queryID = telegram.initDataUnsafe?.query_id;

		if (queryID) {
			fetch(
				'http://localhost:8080/web-data',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						products: cartItems,
						queryID: queryID,
					}),
				}
			);
		} else {
			telegram.sendData(JSON.stringify({products: cartItems,queryID:queryID }));
		}
	}, [cartItems]);
  return (
    <>
      <h1 className='heading'>Bekzod's course</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout} />
      <div className='cards_Container'>
        {
          courses.map(course => (
            <>
              <Card key={course.id} course={course} onAddItem={onAddItem} onRemoveItem={onRemoveItem}/>
            </>
          ))
        }
      </div>
    </>
  )
}

export default App
