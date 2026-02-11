"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Icons } from "@/components/ui/Icons";
import { walletApi } from "@/services/api";
import { formatCurrency, formatDateTime, cn } from "@/utils";
import { Wallet, Transaction } from "@/types";

const WalletPage: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    const walletData = await walletApi.getBalance();
    const transactionsData = await walletApi.getTransactions(page);
    setWallet(walletData);
    setTransactions(transactionsData.data);
  };

  const handleTopUp = async () => {
    setIsLoading(true);
    try {
      const amount = parseFloat(topUpAmount);
      await walletApi.topUp(amount, "SmatPay");
      await loadData();
      setIsTopUpModalOpen(false);
      setTopUpAmount("");
    } catch (error) {
      console.error("Top-up failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "topup":
        return (
          <div className="p-2 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Icons.Wallet size={18} className="text-green-500" />
          </div>
        );
      case "spend":
        return (
          <div className="p-2 bg-destructive/10 rounded-lg flex items-center justify-center">
            <Icons.Campaign size={18} className="text-destructive" />
          </div>
        );
      case "refund":
        return (
          <div className="p-2 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Icons.Refresh size={18} className="text-blue-500" />
          </div>
        );
      default:
        return (
          <div className="p-2 bg-muted rounded-lg flex items-center justify-center">
            <Icons.Wallet size={18} className="text-muted-foreground" />
          </div>
        );
    }
  };

  return (
    <DashboardLayout title="Wallet">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
          <p className="text-muted-foreground mt-1">Manage your advertising funds</p>
        </div>
        <Button
          leftIcon={<Icons.Upload size={18} />}
          onClick={() => setIsTopUpModalOpen(true)}
        >
          Top Up
        </Button>
      </div>

      {/* Balance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-foreground text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">
                Available Balance
              </p>
              <p className="text-4xl font-bold mt-2">
                {formatCurrency(wallet?.balance || 0)}
              </p>
              <p className="text-primary-foreground/80 text-sm mt-2">
                Updated{" "}
                {formatDateTime(wallet?.updatedAt || new Date().toISOString())}
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl flex items-center justify-center">
              <Icons.Wallet size={32} />
            </div>
          </div>
        </Card>

        <Card>
          <Card.Header title="Quick Stats" subtitle="This month" />
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Top-ups</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(15000)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Spent</span>
              <span className="font-semibold text-destructive">
                {formatCurrency(8500)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Refunds</span>
              <span className="font-semibold text-green-500">
                {formatCurrency(500)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <Card.Header
          title="Transaction History"
          subtitle="Recent wallet activity"
          action={
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Icons.Download size={16} />}
            >
              Export
            </Button>
          }
        />
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <div className="flex items-center gap-4">
                {getTransactionIcon(transaction.type)}
                <div>
                  <p className="font-medium text-foreground">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(transaction.createdAt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "font-semibold",
                    transaction.type === "spend"
                      ? "text-destructive"
                      : "text-green-500",
                  )}
                >
                  {transaction.type === "spend" ? "-" : "+"}
                  {formatCurrency(transaction.amount)}
                </p>
                <Badge
                  variant={
                    transaction.status === "completed"
                      ? "success"
                      : transaction.status === "pending"
                        ? "warning"
                        : "error"
                  }
                >
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * 10 + 1} to {page * 10} of{" "}
            {transactions.length} transactions
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Top Up Modal */}
      <Modal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        title="Top Up Wallet"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Amount (ZAR)"
            type="number"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            placeholder="Enter amount"
            leftIcon={<span className="text-muted-foreground">R</span>}
          />

          <div className="grid grid-cols-3 gap-2">
            {[500, 1000, 2000, 5000, 10000, 20000].map((amount) => (
              <button
                key={amount}
                onClick={() => setTopUpAmount(amount.toString())}
                className={cn(
                  "py-2 px-4 rounded-lg border font-medium transition-colors",
                  topUpAmount === amount.toString()
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input hover:border-primary",
                )}
              >
                R{amount}
              </button>
            ))}
          </div>

          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-secondary-foreground">
              <strong>Payment Method:</strong> SmatPay (Mock)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This is a demo. No real payment will be processed.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsTopUpModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleTopUp}
              isLoading={isLoading}
              disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
            >
              Top Up
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default WalletPage;
