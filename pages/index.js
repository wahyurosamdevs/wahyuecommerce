import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import Product from "../components/Product";
import { initMongoose } from "../lib/mongoose";
import { findAllProducts } from "./api/products";

export default function Home({products}) {

  const [phrase, setPhrase] = useState("");

  const categoriesNames = [...new Set(products.map(p => p.category))];
  
  if (phrase) {
    products = products.filter(p => p.name.toLowerCase().includes(phrase));
  }
  
  return(
    <Layout>
      <input type="text" value={phrase} onChange={e => setPhrase(e.target.value)} placeholder="Search for products..." className="bg-gray-100 w-full py-2 px-4 rounded-xl" />
      <div>
        {categoriesNames.map(categoriesName => (
          <div key={categoriesName}>
            {products.find(p => p.category === categoriesName) && (
              <div>
                <h2 className="text-2xl py-5 capitalize">{categoriesName}</h2>
                  <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">
                    {products.filter(p => p.category === categoriesName).map(productInfo => (
                      <div key={productInfo._id} className="px-5 snap-start">
                        <Product {...productInfo} />
                      </div>
                    ))}
                  </div>
              </div>
            )}             
          </div>
        ))}
        
      </div>
    </Layout>
  )
}

export async function getServerSideProps(){
  await initMongoose();
  const products = await findAllProducts();
  return {
    props:{
      products:JSON.parse(JSON.stringify(products)),
    }
  }
}

// export async function getStaticProps(){
//   await initMongoose();
//   const products = await findAllProducts();
//   return {
//     props:{
//       products:JSON.parse(JSON.stringify(products)),
//     }
//   }
// }