import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { ProductContext } from "../components/ProductContext";

export default function CheckoutPage(){
  const {selectedProducts,setSelectedProducts} = useContext(ProductContext);
  const [productsInfos, setProductsInfos] = useState([]);
  const [address,setAddress] = useState('');
  const [city,setCity] = useState('');
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');

  useEffect(() => {
    const uniqIds = [...new Set(selectedProducts)];
    fetch('/api/products?ids='+uniqIds.join(','))
      .then(response => response.json())
      .then(json => setProductsInfos(json));
  },[selectedProducts])

  function moreOfThisProduct(id){
    setSelectedProducts(prev => [...prev,id]);
  }
  console.log(setProductsInfos);

  function lessOfThisProduct(id){
    const pos = selectedProducts.indexOf(id);
    if (pos !== -1) {
      setSelectedProducts(prev => {
        return prev.filter((value,index) => index !== pos)
      })
    }
  }

  const deliveryPrice = 5;
  let subtotal = 0;
  if (selectedProducts?.length) {
    for(let id of selectedProducts){
      console.log(productsInfos.find(p => p._id === id));
      if (productsInfos.find(p => p._id === id)) {
        const price = productsInfos.find(p => p._id === id).price;
        subtotal += price;        
      }
    }
  }

  let total = subtotal + deliveryPrice;

  
  return(
    <Layout>
      {!productsInfos.length && (
        <div>no products in your shopping cart</div>
      )}
      {productsInfos.length && productsInfos.map(productsInfo =>(
        <div className={(selectedProducts.filter(id => id === productsInfo._id).length > 0) ? "w-full flex mb-5 " : "hidden" } key={productsInfo._id}>
          <div className="bg-gray-100 p-3 rounded-xl shrink-0">
            <img className="w-24" src={productsInfo.picture} alt="" />
          </div>
          <div className="pl-4 w-full">
            <h3 className="font-bold text-lg">{productsInfo.name}</h3>
            <p className="text-sm leading-4 text-gray-500">{productsInfo.description}</p>
            <div className="flex">
              <div className="grow">${productsInfo.price}</div>
              <div>
                <button onClick={() => lessOfThisProduct(productsInfo._id)} className="border border-emerald-500 px-2 rounded-lg text-emerald-500">-</button>
                <span className="px-2">
                  {selectedProducts.filter(id => id === productsInfo._id).length}
                </span>
                <button onClick={() => moreOfThisProduct(productsInfo._id)} className="bg-emerald-500 px-2 rounded-lg text-white">+</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-4">
        <input value={address} onChange={(e) => setAddress(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="Street address, number"/> 
        <input value={city} onChange={(e) => setCity(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="City and postal code"/> 
        <input value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="Your name"/> 
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="email" placeholder="Email address"/>       
      </div>
      <div className="mt-4">
        <div className="flex my-3">
          <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
          <h3 className="font-bold">${subtotal}</h3>
        </div>
        <div className="flex my-3">
          <h3 className="grow font-bold text-gray-400">Delivery:</h3>
          <h3 className="font-bold">${deliveryPrice}</h3>
        </div>
        <div className="flex my-3 border-t pt-3 border-dashed border-emerald-500">
          <h3 className="grow font-bold text-gray-400">Total:</h3>
          <h3 className="font-bold">${total}</h3>
        </div>        
      </div>
      <Link href="/?success=true">
        <button className="bg-emerald-500 px-5 py-2 rounded-xl font-bold text-white w-full my-4 shadow-emerald-300 shadow-lg">Pay ${total}</button>
      </Link>
    </Layout>
  )
}