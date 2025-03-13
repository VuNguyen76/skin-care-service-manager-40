
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  blogApi, 
  serviceApi, 
  specialistApi, 
  bookingApi, 
  reviewApi, 
  categoryApi, 
  userApi, 
  statsApi 
} from "@/services/api";

const ApiTestPanel = () => {
  const [selectedApi, setSelectedApi] = useState<string>("blog");
  const [responseData, setResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const apiMap: Record<string, any> = {
    blog: blogApi,
    service: serviceApi,
    specialist: specialistApi,
    booking: bookingApi,
    review: reviewApi,
    category: categoryApi,
    user: userApi,
    stats: statsApi
  };
  
  const methodOptions: Record<string, any> = {
    blog: [
      { label: "Get All Blogs", method: "getAll", params: { published: true } },
      { label: "Get Blog By ID", method: "getById", params: 1 }
    ],
    service: [
      { label: "Get All Services", method: "getAll" },
      { label: "Get Service By ID", method: "getById", params: 1 }
    ],
    specialist: [
      { label: "Get All Specialists", method: "getAll" },
      { label: "Get Top Rated Specialists", method: "getTopRated" }
    ],
    booking: [
      { label: "Get My Bookings", method: "getMyBookings" }
    ],
    category: [
      { label: "Get All Categories", method: "getAll" }
    ]
  };
  
  const [selectedMethod, setSelectedMethod] = useState<string>(
    methodOptions[selectedApi]?.[0]?.method || ""
  );
  
  const handleApiChange = (api: string) => {
    setSelectedApi(api);
    setSelectedMethod(methodOptions[api]?.[0]?.method || "");
    setResponseData(null);
    setError(null);
  };
  
  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
    setResponseData(null);
    setError(null);
  };
  
  const executeApiCall = async () => {
    setIsLoading(true);
    setResponseData(null);
    setError(null);
    
    try {
      const api = apiMap[selectedApi];
      const methodConfig = methodOptions[selectedApi].find((m: any) => m.method === selectedMethod);
      
      if (!api || !methodConfig) {
        throw new Error("Invalid API or method selection");
      }
      
      let result;
      if (methodConfig.params) {
        result = await api[methodConfig.method](methodConfig.params);
      } else {
        result = await api[methodConfig.method]();
      }
      
      setResponseData(result);
    } catch (err: any) {
      setError(err.message || "An error occurred during the API call");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Test Panel</CardTitle>
        <CardDescription>Test API functionality and connections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select API</label>
            <Select value={selectedApi} onValueChange={handleApiChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select an API" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog API</SelectItem>
                <SelectItem value="service">Service API</SelectItem>
                <SelectItem value="specialist">Specialist API</SelectItem>
                <SelectItem value="booking">Booking API</SelectItem>
                <SelectItem value="category">Category API</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Select Method</label>
            <Select value={selectedMethod} onValueChange={handleMethodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                {methodOptions[selectedApi]?.map((option: any) => (
                  <SelectItem key={option.method} value={option.method}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={executeApiCall} 
          disabled={isLoading || !selectedApi || !selectedMethod}
          className="w-full"
        >
          {isLoading ? "Loading..." : "Execute API Call"}
        </Button>
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {responseData && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Response:</h3>
            <div className="p-4 bg-gray-50 rounded-md overflow-auto max-h-60">
              <pre className="text-xs">{JSON.stringify(responseData, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTestPanel;
