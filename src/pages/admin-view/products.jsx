import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  Package, 
  Tag, 
  DollarSign,
  ShoppingCart
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  const { productList, isLoading } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            toast({
              title: "Product updated successfully",
            });
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            setUploadedImageUrl("");
            toast({
              title: "Product added successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Product deleted successfully",
        });
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Filter products based on search and filters
  const filteredProducts = productList?.filter(product => {
    const matchesSearch = 
      product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" || product?.category === categoryFilter;
    
    const matchesBrand = 
      brandFilter === "all" || product?.brand === brandFilter;
    
    return matchesSearch && matchesCategory && matchesBrand;
  }) || [];

  // Get unique categories and brands for filters
  const categories = [...new Set(productList?.map(product => product?.category) || [])];
  const brands = [...new Set(productList?.map(product => product?.brand) || [])];

  // Calculate statistics
  const totalProducts = productList?.length || 0;
  const totalStock = productList?.reduce((sum, product) => sum + (parseInt(product?.totalStock) || 0), 0) || 0;
  const lowStockProducts = productList?.filter(product => parseInt(product?.totalStock) < 10)?.length || 0;

  return (
    <Fragment>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground">
              Manage your product catalog and inventory
            </p>
          </div>
          <Button 
            onClick={() => setOpenCreateProductsDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Stock</p>
                  <p className="text-2xl font-bold">{totalStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Tag className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold">{lowStockProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>
                  {brand.charAt(0).toUpperCase() + brand.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "grid" ? "default" : "outline"} 
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "outline"} 
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredProducts.map((productItem) => (
                  <div key={productItem._id} className="p-4 flex items-center gap-4">
                    <img
                      src={productItem.image}
                      alt={productItem.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{productItem.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{productItem.category}</Badge>
                        <Badge variant="outline">{productItem.brand}</Badge>
                        <Badge variant={parseInt(productItem.totalStock) < 10 ? "destructive" : "default"}>
                          {productItem.totalStock} in stock
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {productItem.salePrice > 0 ? (
                          <>
                            <span className="font-medium">${productItem.salePrice}</span>
                            <span className="text-sm text-muted-foreground line-through">${productItem.price}</span>
                          </>
                        ) : (
                          <span className="font-medium">${productItem.price}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setOpenCreateProductsDialog(true);
                          setCurrentEditedId(productItem._id);
                          setFormData(productItem);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(productItem._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || categoryFilter !== "all" || brandFilter !== "all"
              ? "No products match your search criteria"
              : "Get started by adding a new product"}
          </p>
          <Button onClick={() => setOpenCreateProductsDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>
      )}

      {/* Product Form Sheet */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setImageFile(null);
          setUploadedImageUrl("");
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isEditMode={currentEditedId !== null}
            />
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update Product" : "Add Product"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
