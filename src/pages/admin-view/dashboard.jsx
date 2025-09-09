import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  CloudUpload, 
  Image, 
  Images, 
  UploadCloud,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'
  const dispatch = useDispatch();
  const { featureImageList, isLoading } = useSelector((state) => state.commonFeature);
  const { toast } = useToast();

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) {
      toast({
        title: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setUploadStatus(null);
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
        setUploadStatus("success");
        toast({
          title: "Image uploaded successfully",
          description: "The feature image has been added to the carousel",
        });
      } else {
        setUploadStatus("error");
        toast({
          title: "Upload failed",
          description: "Failed to upload the feature image",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your storefront and featured content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudUpload className="h-5 w-5" />
                Upload Feature Image
              </CardTitle>
              <CardDescription>
                Add images to your homepage carousel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isCustomStyling={true}
              />
              
              <div className="mt-6">
                <Button 
                  onClick={handleUploadFeatureImage} 
                  className="w-full"
                  disabled={!uploadedImageUrl || imageLoadingState}
                >
                  {imageLoadingState ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Upload to Carousel
                    </>
                  )}
                </Button>
                
                {/* Upload Status */}
                {uploadStatus && (
                  <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                    uploadStatus === 'success' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {uploadStatus === 'success' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                    <span>
                      {uploadStatus === 'success' 
                        ? 'Image uploaded successfully!' 
                        : 'Upload failed. Please try again.'}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current Feature Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Images className="h-5 w-5" />
                Current Feature Images
              </CardTitle>
              <CardDescription>
                Images currently displayed in the homepage carousel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="h-48 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : featureImageList && featureImageList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featureImageList.map((featureImgItem, index) => (
                    <div 
                      key={featureImgItem._id} 
                      className="relative group overflow-hidden rounded-lg border"
                    >
                      <img
                        src={featureImgItem.image}
                        alt={`Feature ${index + 1}`}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Badge variant="secondary" className="bg-white/90">
                          Position {index + 1}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No feature images</h3>
                  <p className="text-muted-foreground">
                    Upload images to display them in the homepage carousel
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats and Info */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Carousel Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Total Images</span>
                <span className="text-2xl font-bold">
                  {featureImageList?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Max Images</span>
                <span className="text-2xl font-bold">10</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Storage Used</span>
                <span className="text-2xl font-bold">0 MB</span>
              </div>
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">1.</span>
                  <span>Upload high-quality images (1920x600 recommended)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">2.</span>
                  <span>Use landscape-oriented images for best results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">3.</span>
                  <span>Keep file size under 5MB</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">4.</span>
                  <span>Images will appear in the homepage carousel</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Use compelling visuals that represent your brand</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Include text overlays for better engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Rotate images regularly to keep content fresh</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
