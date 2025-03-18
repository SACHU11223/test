"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Store,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Upload,
  Trash2,
  Edit,
  Search,
  Filter,
  ArrowUpDown,
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

// Sample product data for agent
const AGENT_PRODUCTS = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `Agent Product ${i + 1}`,
  description: "Premium quality with exquisite craftsmanship",
  price: Math.floor(Math.random() * 100) + 50,
  image: `/placeholder.svg?height=200&width=200&text=Product+${i + 1}`,
  stock: Math.floor(Math.random() * 50) + 1,
  category: i % 3 === 0 ? "Clothing" : i % 3 === 1 ? "Accessories" : "Home Decor",
  status: i % 4 === 0 ? "Draft" : "Published",
  sales: Math.floor(Math.random() * 100),
  revenue: Math.floor(Math.random() * 5000) + 500,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
}))

// Sample sales data
const SALES_DATA = {
  totalSales: 1245,
  totalRevenue: 78650,
  averageOrder: 63.17,
  customers: 876,
  monthlyData: [
    { month: "Jan", sales: 42, revenue: 2650 },
    { month: "Feb", sales: 58, revenue: 3720 },
    { month: "Mar", sales: 75, revenue: 4890 },
    { month: "Apr", sales: 92, revenue: 5840 },
    { month: "May", sales: 110, revenue: 7250 },
    { month: "Jun", sales: 135, revenue: 8760 },
    { month: "Jul", sales: 162, revenue: 10450 },
    { month: "Aug", sales: 188, revenue: 12340 },
    { month: "Sep", sales: 165, revenue: 10780 },
    { month: "Oct", sales: 142, revenue: 9120 },
    { month: "Nov", sales: 98, revenue: 6230 },
    { month: "Dec", sales: 78, revenue: 4980 },
  ],
  topProducts: [
    { id: 3, name: "Agent Product 3", sales: 87, revenue: 4350 },
    { id: 7, name: "Agent Product 7", sales: 65, revenue: 3250 },
    { id: 1, name: "Agent Product 1", sales: 54, revenue: 2700 },
    { id: 9, name: "Agent Product 9", sales: 42, revenue: 2100 },
    { id: 5, name: "Agent Product 5", sales: 38, revenue: 1900 },
  ],
}

export default function AgentDashboardPage() {
  const [products, setProducts] = useState(AGENT_PRODUCTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)

  // New product form state
  const [newProductName, setNewProductName] = useState("")
  const [newProductDescription, setNewProductDescription] = useState("")
  const [newProductPrice, setNewProductPrice] = useState("")
  const [newProductStock, setNewProductStock] = useState("")
  const [newProductCategory, setNewProductCategory] = useState("Clothing")
  const [newProductStatus, setNewProductStatus] = useState("Published")

  const router = useRouter()

  // Check if user is logged in as agent
  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "agent") {
      router.push("/login")
    }
  }, [router])

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = categoryFilter === "All" || product.category === categoryFilter

      // Status filter
      const matchesStatus = statusFilter === "All" || product.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      // Sort products
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === "priceHigh") {
        return b.price - a.price
      } else if (sortBy === "priceLow") {
        return a.price - b.price
      } else if (sortBy === "bestSelling") {
        return b.sales - a.sales
      }
      return 0
    })

  // Handle add product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()

    const newProduct = {
      id: products.length + 1,
      name: newProductName,
      description: newProductDescription,
      price: Number.parseFloat(newProductPrice),
      stock: Number.parseInt(newProductStock),
      category: newProductCategory,
      status: newProductStatus,
      image: `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(newProductName)}`,
      sales: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
    }

    setProducts([newProduct, ...products])

    // Reset form
    setNewProductName("")
    setNewProductDescription("")
    setNewProductPrice("")
    setNewProductStock("")
    setNewProductCategory("Clothing")
    setNewProductStatus("Published")

    setIsAddProductOpen(false)

    toast({
      title: "Product Added",
      description: "Your product has been added successfully.",
      duration: 3000,
    })
  }

  // Handle edit product
  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentProduct) return

    const updatedProducts = products.map((product) => {
      if (product.id === currentProduct.id) {
        return {
          ...product,
          name: newProductName,
          description: newProductDescription,
          price: Number.parseFloat(newProductPrice),
          stock: Number.parseInt(newProductStock),
          category: newProductCategory,
          status: newProductStatus,
        }
      }
      return product
    })

    setProducts(updatedProducts)
    setIsEditProductOpen(false)

    toast({
      title: "Product Updated",
      description: "Your product has been updated successfully.",
      duration: 3000,
    })
  }

  // Handle delete product
  const handleDeleteProduct = (id: number) => {
    const updatedProducts = products.filter((product) => product.id !== id)
    setProducts(updatedProducts)

    toast({
      title: "Product Deleted",
      description: "Your product has been deleted successfully.",
      duration: 3000,
    })
  }

  // Open edit product dialog
  const openEditDialog = (product: any) => {
    setCurrentProduct(product)
    setNewProductName(product.name)
    setNewProductDescription(product.description)
    setNewProductPrice(product.price.toString())
    setNewProductStock(product.stock.toString())
    setNewProductCategory(product.category)
    setNewProductStatus(product.status)
    setIsEditProductOpen(true)
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userType")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-dark-agent">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-black/50 backdrop-blur-md">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <h1 className="text-xl font-bold text-gradient-agent font-serif">LuxeMarket Agent</h1>
            </div>
            <div className="flex flex-col flex-1 px-3 space-y-1">
              <Button variant="ghost" className="justify-start text-white hover:bg-orange-900/30 hover:text-orange-300">
                <Store className="mr-2 h-5 w-5" />
                Products
              </Button>
              <Button variant="ghost" className="justify-start text-white hover:bg-orange-900/30 hover:text-orange-300">
                <Package className="mr-2 h-5 w-5" />
                Orders
              </Button>
              <Button variant="ghost" className="justify-start text-white hover:bg-orange-900/30 hover:text-orange-300">
                <BarChart3 className="mr-2 h-5 w-5" />
                Analytics
              </Button>
              <Button variant="ghost" className="justify-start text-white hover:bg-orange-900/30 hover:text-orange-300">
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>
              <div className="flex-1"></div>
              <Button
                variant="ghost"
                className="justify-start text-red-400 hover:bg-red-900/30 hover:text-red-300 mt-auto mb-6"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-black/50 backdrop-blur-md border-b border-orange-900/30">
            <div className="flex items-center md:hidden">
              <h1 className="text-xl font-bold text-gradient-agent font-serif">LuxeMarket Agent</h1>
            </div>
            <div className="flex items-center ml-auto">
              <Button variant="ghost" className="text-white hover:bg-orange-900/30 hover:text-orange-300 md:hidden">
                <Store className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-orange-900/30 hover:text-orange-300 md:hidden">
                <Package className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-orange-900/30 hover:text-orange-300 md:hidden">
                <BarChart3 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-orange-900/30 hover:text-orange-300 md:hidden">
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                className="text-red-400 hover:bg-red-900/30 hover:text-red-300 md:hidden"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Dashboard content */}
          <main className="flex-1 p-6">
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/30">
                <TabsTrigger
                  value="products"
                  className="text-white data-[state=active]:bg-orange-900/50 data-[state=active]:text-white"
                >
                  Products
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="text-white data-[state=active]:bg-orange-900/50 data-[state=active]:text-white"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="text-white data-[state=active]:bg-orange-900/50 data-[state=active]:text-white"
                >
                  Orders
                </TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white font-serif">Your Products</h2>
                  <Button className="btn-gradient-agent text-white" onClick={() => setIsAddProductOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10 bg-black/30 border-orange-900/30 text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Filter className="text-gray-400 h-4 w-4" />
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="bg-black/30 border-orange-900/30 text-white">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-orange-900/30 text-white">
                        <SelectItem value="All">All Categories</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Home Decor">Home Decor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Filter className="text-gray-400 h-4 w-4" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-black/30 border-orange-900/30 text-white">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-orange-900/30 text-white">
                        <SelectItem value="All">All Status</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <ArrowUpDown className="text-gray-400 h-4 w-4" />
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-black/30 border-orange-900/30 text-white">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-orange-900/30 text-white">
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                        <SelectItem value="priceLow">Price: Low to High</SelectItem>
                        <SelectItem value="bestSelling">Best Selling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="bg-black/30 border-orange-900/30 text-white overflow-hidden">
                      <div className="relative h-48 bg-black/50">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-contain p-4"
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-black/50 hover:bg-orange-900/50 text-white"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-black/50 hover:bg-red-900/50 text-white"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Badge
                          className={`absolute top-2 left-2 ${
                            product.status === "Published"
                              ? "bg-green-900/70 text-green-300"
                              : "bg-gray-900/70 text-gray-300"
                          }`}
                        >
                          {product.status}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-white">{product.name}</CardTitle>
                        <CardDescription className="text-gray-400">{product.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-sm line-clamp-2 mb-4">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-400">Price</p>
                            <p className="text-lg font-bold text-gradient-agent">${product.price}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Stock</p>
                            <p className="text-lg font-bold text-white">{product.stock}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Sales</p>
                            <p className="text-lg font-bold text-white">{product.sales}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="h-16 w-16 text-gray-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                    <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                    <Button className="btn-gradient-agent text-white" onClick={() => setIsAddProductOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Product
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <h2 className="text-2xl font-bold text-white font-serif mb-6">Sales Analytics</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-black/30 border-orange-900/30 text-white">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-gray-400">Total Sales</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <ShoppingBag className="h-8 w-8 text-orange-400 mr-3" />
                        <div>
                          <p className="text-3xl font-bold text-white">{SALES_DATA.totalSales}</p>
                          <p className="text-sm text-green-400">+12.5% from last month</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/30 border-orange-900/30 text-white">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-gray-400">Total Revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-orange-400 mr-3" />
                        <div>
                          <p className="text-3xl font-bold text-white">${SALES_DATA.totalRevenue.toLocaleString()}</p>
                          <p className="text-sm text-green-400">+8.3% from last month</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/30 border-orange-900/30 text-white">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-gray-400">Average Order</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-orange-400 mr-3" />
                        <div>
                          <p className="text-3xl font-bold text-white">${SALES_DATA.averageOrder}</p>
                          <p className="text-sm text-green-400">+3.7% from last month</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/30 border-orange-900/30 text-white">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-gray-400">Total Customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-orange-400 mr-3" />
                        <div>
                          <p className="text-3xl font-bold text-white">{SALES_DATA.customers}</p>
                          <p className="text-sm text-green-400">+5.2% from last month</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Monthly Sales Chart */}
                <Card className="bg-black/30 border-orange-900/30 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Monthly Sales Performance</CardTitle>
                    <CardDescription className="text-gray-400">
                      Sales and revenue over the past 12 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-end justify-between gap-2">
                      {SALES_DATA.monthlyData.map((month) => (
                        <div key={month.month} className="flex flex-col items-center">
                          <div className="relative w-12 flex-1 flex flex-col justify-end">
                            <div
                              className="w-full bg-orange-900/50 rounded-t-sm"
                              style={{ height: `${(month.sales / 200) * 100}%` }}
                            ></div>
                            <div
                              className="w-full bg-orange-500/50 rounded-t-sm absolute bottom-0"
                              style={{ height: `${(month.revenue / 15000) * 100}%`, maxHeight: "80%" }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">{month.month}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-4 space-x-6">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-900/50 rounded-sm mr-2"></div>
                        <span className="text-sm text-gray-400">Sales</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-500/50 rounded-sm mr-2"></div>
                        <span className="text-sm text-gray-400">Revenue</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="bg-black/30 border-orange-900/30 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Top Selling Products</CardTitle>
                    <CardDescription className="text-gray-400">Your best performing products by sales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {SALES_DATA.topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-orange-900/50 flex items-center justify-center text-white font-bold mr-4">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-400">{product.sales} sales</p>
                          </div>
                          <p className="text-lg font-bold text-gradient-agent">${product.revenue}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <h2 className="text-2xl font-bold text-white font-serif mb-6">Recent Orders</h2>

                <Card className="bg-black/30 border-orange-900/30 text-white">
                  <CardContent className="p-0">
                    <div className="relative overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="text-gray-400 text-xs uppercase border-b border-orange-900/30">
                          <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-900/30">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <tr key={i} className="hover:bg-orange-900/10">
                              <td className="px-6 py-4 font-medium text-white">#{(1000 + i).toString()}</td>
                              <td className="px-6 py-4 text-gray-300">Customer {i + 1}</td>
                              <td className="px-6 py-4 text-gray-300">
                                Agent Product {Math.floor(Math.random() * 10) + 1}
                              </td>
                              <td className="px-6 py-4 text-gray-300">
                                {new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-gray-300">
                                ${(Math.floor(Math.random() * 200) + 50).toFixed(2)}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    i % 3 === 0
                                      ? "bg-green-900/30 text-green-300"
                                      : i % 3 === 1
                                        ? "bg-orange-900/30 text-orange-300"
                                        : "bg-blue-900/30 text-blue-300"
                                  }`}
                                >
                                  {i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Processing" : "Shipped"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="bg-gradient-dark-agent text-white border-orange-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-gradient-agent">Add New Product</DialogTitle>
            <DialogDescription className="text-gray-300">
              Fill in the details to add a new product to your store.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name" className="text-white">
                Product Name
              </Label>
              <Input
                id="product-name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="bg-black/50 border-orange-900 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description" className="text-white">
                Description
              </Label>
              <Textarea
                id="product-description"
                value={newProductDescription}
                onChange={(e) => setNewProductDescription(e.target.value)}
                className="bg-black/50 border-orange-900 text-white min-h-[100px]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-price" className="text-white">
                  Price ($)
                </Label>
                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="bg-black/50 border-orange-900 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-stock" className="text-white">
                  Stock
                </Label>
                <Input
                  id="product-stock"
                  type="number"
                  min="0"
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  className="bg-black/50 border-orange-900 text-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-category" className="text-white">
                  Category
                </Label>
                <Select value={newProductCategory} onValueChange={setNewProductCategory}>
                  <SelectTrigger id="product-category" className="bg-black/50 border-orange-900 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-orange-900 text-white">
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Home Decor">Home Decor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-status" className="text-white">
                  Status
                </Label>
                <Select value={newProductStatus} onValueChange={setNewProductStatus}>
                  <SelectTrigger id="product-status" className="bg-black/50 border-orange-900 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-orange-900 text-white">
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Product Image</Label>
              <div className="border-2 border-dashed border-orange-900/50 rounded-lg p-6 text-center">
                <Upload className="h-10 w-10 text-orange-500 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Drag and drop your image here, or click to browse</p>
                <p className="text-xs text-gray-400">PNG, JPG or WEBP (max. 2MB)</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4 border-orange-900/50 text-orange-300 hover:bg-orange-900/20"
                >
                  Upload Image
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="border-orange-900/50 text-orange-300 hover:bg-orange-900/20"
                onClick={() => setIsAddProductOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="btn-gradient-agent text-white">
                Add Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="bg-gradient-dark-agent text-white border-orange-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-gradient-agent">Edit Product</DialogTitle>
            <DialogDescription className="text-gray-300">Update the details of your product.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProduct} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-product-name" className="text-white">
                Product Name
              </Label>
              <Input
                id="edit-product-name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="bg-black/50 border-orange-900 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-product-description" className="text-white">
                Description
              </Label>
              <Textarea
                id="edit-product-description"
                value={newProductDescription}
                onChange={(e) => setNewProductDescription(e.target.value)}
                className="bg-black/50 border-orange-900 text-white min-h-[100px]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-product-price" className="text-white">
                  Price ($)
                </Label>
                <Input
                  id="edit-product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="bg-black/50 border-orange-900 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-product-stock" className="text-white">
                  Stock
                </Label>
                <Input
                  id="edit-product-stock"
                  type="number"
                  min="0"
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  className="bg-black/50 border-orange-900 text-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-product-category" className="text-white">
                  Category
                </Label>
                <Select value={newProductCategory} onValueChange={setNewProductCategory}>
                  <SelectTrigger id="edit-product-category" className="bg-black/50 border-orange-900 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-orange-900 text-white">
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Home Decor">Home Decor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-product-status" className="text-white">
                  Status
                </Label>
                <Select value={newProductStatus} onValueChange={setNewProductStatus}>
                  <SelectTrigger id="edit-product-status" className="bg-black/50 border-orange-900 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-orange-900 text-white">
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="border-orange-900/50 text-orange-300 hover:bg-orange-900/20"
                onClick={() => setIsEditProductOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="btn-gradient-agent text-white">
                Update Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

