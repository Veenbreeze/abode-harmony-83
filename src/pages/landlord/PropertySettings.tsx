import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function PropertySettings({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-green-100">
      <Card className="shadow-2xl border-0 rounded-2xl bg-white/90 max-w-xl w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Settings className="h-6 w-6 text-purple-500" />
            Property Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              className="border border-purple-300 rounded-lg px-3 py-2 bg-purple-50"
              placeholder="Property Name"
            />
            <input
              type="number"
              className="border border-purple-300 rounded-lg px-3 py-2 bg-purple-50"
              placeholder="Default Monthly Rent"
            />
            <input
              type="number"
              className="border border-purple-300 rounded-lg px-3 py-2 bg-purple-50"
              placeholder="Payment Due Date (1-31)"
              min={1}
              max={31}
            />
            <Button type="submit" variant="outline" className="w-full bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold shadow-md hover:from-purple-500 hover:to-blue-500">
              Save Settings
            </Button>
          </form>
          <Button
            variant="outline"
            className="mt-6 w-full border-purple-300 text-purple-700 hover:bg-purple-50 font-medium"
            onClick={onBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
  
