import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function RequestExtension({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100">
      <Card className="shadow-2xl border-0 rounded-2xl bg-white/90 max-w-lg w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <Clock className="h-6 w-6 text-yellow-500" />
            Request Payment Extension
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <textarea
              className="w-full border border-yellow-300 rounded-lg px-3 py-2 bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              rows={4}
              placeholder="Reason for extension..."
            />
            <Button type="submit" variant="outline" className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold shadow-md hover:from-yellow-500 hover:to-orange-500">
              Submit Request
            </Button>
          </form>
          <Button
            variant="outline"
            className="mt-6 w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 font-medium"
            onClick={onBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
  