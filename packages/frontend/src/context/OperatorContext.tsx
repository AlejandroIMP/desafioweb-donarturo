import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getProduct, getProducts, createProduct, updateProduct, updateProductState } from '../services/products.service';
import { IProduct } from '../interfaces/product.interface';

