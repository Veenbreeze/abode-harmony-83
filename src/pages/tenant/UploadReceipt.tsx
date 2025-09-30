import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function UploadReceipt({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Receipt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <label htmlFor="receipt-upload" className="mb-2 block font-medium">
              Receipt File
            </label>
            <input
              id="receipt-upload"
              type="file"
              className="mb-4"
              title="Upload your receipt file"
            />
            <Button type="submit" variant="premium">Submit Receipt</Button>
          </form>
          <Button
            variant="outline"
            className="mt-6 w-full"
            onClick={onBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
