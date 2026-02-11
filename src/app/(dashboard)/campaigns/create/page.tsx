"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Icons } from "@/components/ui/Icons";
import { categoriesApi, creatorsApi } from "@/services/api";
import {
  Category,
  Creator,
  CampaignType,
  PlacementType,
  TargetType,
} from "@/types";
import { cn } from "@/utils";

const CreateCampaignPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [campaignType, setCampaignType] = useState<CampaignType>("category");
  const [categories, setCategories] = useState<Category[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [budget, setBudget] = useState(0);
  const [durationDays, setDurationDays] = useState(7);
  const [targetType, setTargetType] = useState<TargetType>("impressions");
  const [targetValue, setTargetValue] = useState(0);
  const [placements, setPlacements] = useState<PlacementType[]>(["pre_roll"]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cats = await categoriesApi.getAll();
    const crs = await creatorsApi.getAll();
    setCategories(cats);
    setCreators(crs);
  };

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleCreatorToggle = (id: string) => {
    setSelectedCreators((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handlePlacementToggle = (placement: PlacementType) => {
    setPlacements((prev) =>
      prev.includes(placement)
        ? prev.filter((p) => p !== placement)
        : [...prev, placement],
    );
  };

  const calculateBudget = () => {
    const cpm = 10; // Cost per 1000 impressions
    const cpc = 0.5; // Cost per click
    if (targetType === "impressions") {
      return (targetValue / 1000) * cpm;
    }
    return targetValue * cpc;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate campaign creation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/campaigns");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Campaign">
      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <button
              onClick={() => s < step && setStep(s)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step >= s
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-600",
              )}
            >
              {s}
            </button>
            {s < 4 && (
              <div
                className={cn(
                  "flex-1 h-1 rounded",
                  step > s ? "bg-primary-600" : "bg-gray-200",
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Campaign Type */}
      {step === 1 && (
        <Card>
          <Card.Header
            title="Choose Campaign Type"
            subtitle="How do you want to target your audience?"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setCampaignType("category")}
              className={cn(
                "p-6 border-2 rounded-xl text-left transition-colors",
                campaignType === "category"
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300",
              )}
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-primary-100 rounded-lg">
                <Icons.Filter size={24} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Category Based</h3>
              <p className="text-sm text-gray-500 mt-1">
                Target ads to specific TESE content categories
              </p>
            </button>
            <button
              onClick={() => setCampaignType("creator")}
              className={cn(
                "p-6 border-2 rounded-xl text-left transition-colors",
                campaignType === "creator"
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300",
              )}
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-primary-100 rounded-lg">
                <Icons.Users size={24} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Creator Targeted</h3>
              <p className="text-sm text-gray-500 mt-1">
                Select specific TESE creators for your ads
              </p>
            </button>
          </div>
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setStep(2)}
              rightIcon={<Icons.ChevronRight size={16} />}
            >
              Next Step
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Targeting */}
      {step === 2 && (
        <Card>
          <Card.Header
            title={
              campaignType === "category"
                ? "Select Categories"
                : "Select Creators"
            }
            subtitle={
              campaignType === "category"
                ? "Choose categories for your ads"
                : "Choose creators for your ads"
            }
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {campaignType === "category"
              ? categories.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleCategoryToggle(item.id)}
                    className={cn(
                      "p-4 border rounded-lg text-left transition-colors",
                      selectedCategories.includes(item.id)
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <p className="font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.creatorCount} creators
                    </p>
                  </button>
                ))
              : creators.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleCreatorToggle(item.id)}
                    className={cn(
                      "p-4 border rounded-lg text-left transition-colors",
                      selectedCreators.includes(item.id)
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <p className="font-medium text-gray-900 truncate">
                      {item.channelName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.subscriberCount} subscribers
                    </p>
                  </button>
                ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              leftIcon={<Icons.ChevronLeft size={16} />}
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={
                selectedCategories.length === 0 && selectedCreators.length === 0
              }
              rightIcon={<Icons.ChevronRight size={16} />}
            >
              Next Step
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Campaign Details */}
      {step === 3 && (
        <Card>
          <Card.Header
            title="Campaign Details"
            subtitle="Configure your ad campaign"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Campaign Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter campaign name"
            />
            <Input
              label="Target URL"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your campaign"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placement
            </label>
            <div className="flex gap-4">
              {(["pre_roll", "mid_roll"] as PlacementType[]).map(
                (placement) => (
                  <button
                    key={placement}
                    onClick={() => handlePlacementToggle(placement)}
                    className={cn(
                      "px-4 py-2 rounded-lg border font-medium transition-colors",
                      placements.includes(placement)
                        ? "border-primary-600 bg-primary-50 text-primary-600"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    {placement === "pre_roll" ? "Pre Roll" : "Mid Roll"}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              leftIcon={<Icons.ChevronLeft size={16} />}
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(4)}
              rightIcon={<Icons.ChevronRight size={16} />}
            >
              Next Step
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Budget & Schedule */}
      {step === 4 && (
        <Card>
          <Card.Header
            title="Budget & Schedule"
            subtitle="Set your budget and campaign duration"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Budget (ZAR)"
              type="number"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
              placeholder="Enter budget"
              leftIcon={
                <span className="text-gray-400 text-sm font-medium">R</span>
              }
            />
            <Input
              label="Duration (Days)"
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value))}
              placeholder="Number of days"
            />
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Type
              </label>
              <div className="relative">
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as TargetType)}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="impressions">Impressions</option>
                  <option value="clicks">Clicks</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <Icons.ChevronDown size={16} />
                </div>
              </div>
            </div>
            <Input
              label={`Target ${targetType === "impressions" ? "Impressions" : "Clicks"}`}
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(parseInt(e.target.value))}
              placeholder={`Enter target ${targetType}`}
            />
          </div>

          {/* Budget Calculator */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Budget Estimate</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {calculateBudget().toLocaleString("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                  })}
                </p>
                <p className="text-sm text-gray-500">Estimated Cost</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {durationDays}
                </p>
                <p className="text-sm text-gray-500">Days</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {(calculateBudget() / durationDays).toLocaleString("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                  })}
                </p>
                <p className="text-sm text-gray-500">Daily Budget</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(3)}
              leftIcon={<Icons.ChevronLeft size={16} />}
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              leftIcon={<Icons.Campaign size={12} />}
            >
              Create Campaign
            </Button>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default CreateCampaignPage;
