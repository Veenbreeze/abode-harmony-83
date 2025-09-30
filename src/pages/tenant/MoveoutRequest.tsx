import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function MoveoutRequest({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-teal-100 to-blue-100">
      <Card className="shadow-2xl border-0 rounded-2xl bg-white/90 max-w-lg w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <FileText className="h-6 w-6 text-green-500" />
            Move-out Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <textarea
              className="w-full border border-green-300 rounded-lg px-3 py-2 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
              rows={4}
              placeholder="Reason for move-out..."
            />
            <Button type="submit" variant="outline" className="w-full bg-gradient-to-r from-green-400 to-teal-400 text-white font-semibold shadow-md hover:from-green-500 hover:to-teal-500">
              Submit Request
            </Button>
          </form>
          <Button
            variant="outline"
            className="mt-6 w-full border-green-300 text-green-700 hover:bg-green-50 font-medium"
            onClick={onBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
  
