"use client";
import { useUserStore } from '@/store/userStore';
import AdminAuthWrapper from '@/components/AdminAuthWrapper';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/database';
import { getProductAllList, updateProduct, deleteProduct } from '@/lib/fetch';
import AddProduct from "@/components/AddProduct";
import EditProduct from "@/components/EditProduct";

export default function AdminProductPage() {
        const { user } = useUserStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);


    useEffect(() => {
      if (user && user?.is_admin) {
        getProducts();
      }
    }, [user]);

    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await getProductAllList();
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const startEdit = (product: Product) => {
      setEditingProduct(product);
      setIsModalOpen(true);
    };
    
    const handleDeleteProduct = async () => {
      if (!deletingProduct) return;
      
      setIsDeleting(true);
      try {
        const result = await deleteProduct(deletingProduct.id);
        if (result?.success) {
          await getProducts();
          setDeletingProduct(null);
        } else {
          alert('Failed to delete product: ' + (result?.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert('Error deleting product: ' + errorMessage);
      } finally {
        setIsDeleting(false);
      }
    };

    const toggleActive = async (productId: number, currentActive: boolean) => {
      try {
        const { data } = await updateProduct(productId, { active: !currentActive });
        if (data) {
          await getProducts();
        } else {
          alert('Failed to update product status');
        }
      } catch (error) {
        console.error('Error updating product status:', error);
        alert('Failed to update product status');
      }
    };

  return (
    <AdminAuthWrapper>
      <div className="min-h-screen bg-gray-50 pt-[76px]">
        <div className="container mx-auto px-4 py-8">

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {products.length} total products • {products.filter(p => p.active).length} active • {products.filter(p => p.reserved_by).length} reserved
                </p>
              </div>
              <button 
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
                Afegeix producte
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📦</div>
              <p className="text-gray-600">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reserved
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className={product.active ? '' : 'bg-gray-50'}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 mt-1">{product.description}</div>
                          {product.url && (
                            <a href={product.url} target="_blank" rel="noopener noreferrer" 
                               className="text-xs text-blue-600 hover:text-blue-800 mt-1 block">
                              🔗 View Product
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(product.id, product.active)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.active 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {product.active ? '✅ Active' : '❌ Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.reserved_by ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-800">
                            💝 Reserved
                          </span>
                        ) : (
                          <span className="text-gray-400">Available</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => setDeletingProduct(product)}
                            disabled={!!product.reserved_by}
                            className={`${
                              product.reserved_by 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-red-600 hover:text-red-900'
                            }`}
                            title={product.reserved_by ? 'Cannot delete reserved product' : 'Delete product'}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {isModalOpen && editingProduct && (
       <EditProduct 
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onProductEdited={getProducts}
        />
      )}

      {isAddModalOpen && (
          <AddProduct 
            onClose={() => setIsAddModalOpen(false)}
            onProductAdded={getProducts}
          />
        )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ⚠️ Confirmar eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar el producto <strong>{deletingProduct.name}</strong>? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:text-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 disabled:bg-red-400 transition-colors"
              >
                {isDeleting ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Eliminando...
                  </>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminAuthWrapper>
  );
}
