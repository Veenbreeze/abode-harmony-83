import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ReportMaintenance({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-pink-100 to-orange-100">
      <Card className="shadow-2xl border-0 rounded-2xl bg-white/90 max-w-lg w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-6 w-6 text-red-500" />
            Report Maintenance Issue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <textarea
              className="w-full border border-red-300 rounded-lg px-3 py-2 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
              rows={4}
              placeholder="Describe the issue..."
            />
            <Button type="submit" variant="outline" className="w-full bg-gradient-to-r from-red-400 to-pink-400 text-white font-semibold shadow-md hover:from-red-500 hover:to-pink-500">
              Submit Issue
            </Button>
          </form>
          <Button
            variant="outline"
            className="mt-6 w-full border-red-300 text-red-700 hover:bg-red-50 font-medium"
            onClick={onBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
  

