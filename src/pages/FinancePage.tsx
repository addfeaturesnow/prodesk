import { useState, useEffect } from "react";
import { DollarSign, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface FinancialSummary {
  totalRevenue: number;
  totalTransactions: number;
  averageTransactionValue: number;
  totalTax: number;
  totalDiscount: number;
  paymentMethods: {
    [key: string]: number;
  };
  dailyRevenue: Array<{ date: string; amount: number; count: number }>;
  topEquipment: Array<{ name: string; quantity: number; revenue: number }>;
  equipmentInventoryValue: number;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function FinancePage() {
  const { toast } = useToast();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [timeframe, setTimeframe] = useState("30days");

  useEffect(() => {
    loadFinancialSummary();
  }, [dateRange]);

  const updateTimeframe = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    const today = new Date();
    let startDate = new Date();

    switch (newTimeframe) {
      case "7days":
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30days":
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90days":
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "ytd":
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
    }

    setDateRange({
      startDate: startDate.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    });
  };

  const loadFinancialSummary = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const res = await fetch(`/api/finance/summary?${params}`, {
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to load financial summary: ${res.status}`);
      }
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Finance API error:", err);
      toast({
        title: "Error",
        description: "Failed to load financial data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: "csv") => {
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        format,
      });
      const res = await fetch(`/api/finance/export?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `financial-report-${dateRange.startDate}-${dateRange.endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Report exported as CSV",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No financial data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="w-8 h-8" />
            Finance Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date(dateRange.startDate).toLocaleDateString()} —{" "}
            {new Date(dateRange.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: "7 Days", value: "7days" },
          { label: "30 Days", value: "30days" },
          { label: "90 Days", value: "90days" },
          { label: "YTD", value: "ytd" },
        ].map((btn) => (
          <Button
            key={btn.value}
            variant={timeframe === btn.value ? "default" : "outline"}
            size="sm"
            onClick={() => updateTimeframe(btn.value)}
          >
            {btn.label}
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={() => loadFinancialSummary()}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">{summary.totalTransactions} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.averageTransactionValue.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Per sale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Tax Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalTax.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">GST/VAT</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${summary.equipmentInventoryValue.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Current value</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold">Date</th>
                  <th className="text-right py-2 px-3 font-semibold">Revenue</th>
                  <th className="text-right py-2 px-3 font-semibold">Transactions</th>
                  <th className="text-right py-2 px-3 font-semibold">Avg Value</th>
                </tr>
              </thead>
              <tbody>
                {(summary.dailyRevenue || [])
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 15)
                  .map((day, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-3">{new Date(day.date).toLocaleDateString()}</td>
                      <td className="text-right py-3 px-3 font-semibold">${day.amount.toFixed(2)}</td>
                      <td className="text-right py-3 px-3">{day.count}</td>
                      <td className="text-right py-3 px-3">${(day.amount / (day.count || 1)).toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {(!summary.dailyRevenue || summary.dailyRevenue.length === 0) && (
              <div className="text-center py-8 text-gray-500">No revenue data available</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(summary.paymentMethods || {})
              .sort((a, b) => b[1] - a[1])
              .map(([method, amount]) => {
                const percentage = ((amount / summary.totalRevenue) * 100).toFixed(1);
                return (
                  <div key={method} className="border-b pb-3 last:border-b-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium capitalize">{method.replace(/_/g, " ")}</span>
                      <Badge variant="outline">{percentage}%</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>${Number(amount).toFixed(2)}</span>
                      <div className="w-48 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Top Selling Equipment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Top Selling Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold">Equipment</th>
                  <th className="text-right py-2 px-3 font-semibold">Qty Sold</th>
                  <th className="text-right py-2 px-3 font-semibold">Revenue</th>
                  <th className="text-right py-2 px-3 font-semibold">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {(summary.topEquipment || []).map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium">{item.name}</td>
                    <td className="text-right py-3 px-3">{item.quantity}</td>
                    <td className="text-right py-3 px-3 font-semibold">${item.revenue.toFixed(2)}</td>
                    <td className="text-right py-3 px-3">
                      {((item.revenue / summary.totalRevenue) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!summary.topEquipment || summary.topEquipment.length === 0) && (
              <div className="text-center py-8 text-gray-500">No sales data available</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <div className="flex gap-3 justify-end">
        <Button onClick={() => handleExport("csv")} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
        <Button onClick={() => loadFinancialSummary()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
