import React from 'react'
import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductsForm = () => {
    const [newProduct, setNewProduct] = useState({
        name:"",
        description:"",
        price:"",
        category:"",
        countInStock:"",
        image:""
    })
  return (
    <div>CreateProductsForm</div>
  )
}

export default CreateProductsForm