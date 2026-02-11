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
import { cn, formatNumber } from "@/utils";

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
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

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

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("video/")) {
      setVideoError("Please upload a valid video file");
      return;
    }

    // Check file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setVideoError("Video file size must be less than 50MB");
      return;
    }

    // Create video element to check duration
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);

      if (video.duration > 30) {
        setVideoError("Video duration must be 30 seconds or less");
        setVideoFile(null);
        setVideoPreview(null);
        setVideoDuration(null);
      } else {
        setVideoError(null);
        setVideoFile(file);
        setVideoDuration(video.duration);
        setVideoPreview(URL.createObjectURL(file));
      }
    };

    video.onerror = () => {
      setVideoError("Error loading video file");
    };

    video.src = URL.createObjectURL(file);
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setVideoDuration(null);
    setVideoError(null);
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
    <DashboardLayout
      title="Create Campaign"
      breadcrumbs={[
        { label: "Home", href: "/dashboard", icon: Icons.Home },
        { label: "Campaigns", href: "/campaigns", icon: Icons.Campaign },
        { label: "Create Campaign", icon: Icons.Plus },
      ]}
    >
      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <button
              onClick={() => s < step && setStep(s)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {s}
            </button>
            {s < 4 && (
              <div
                className={cn(
                  "flex-1 h-1 rounded",
                  step > s ? "bg-primary" : "bg-muted",
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
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50",
              )}
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-primary/10 rounded-lg">
                <Icons.Filter size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Category Based</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Target ads to specific TESE content categories
              </p>
            </button>
            <button
              onClick={() => setCampaignType("creator")}
              className={cn(
                "p-6 border-2 rounded-xl text-left transition-colors",
                campaignType === "creator"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50",
              )}
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-primary/10 rounded-lg">
                <Icons.Users size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">
                Creator Targeted
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
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
                      "relative h-24 rounded-lg overflow-hidden text-left transition-colors group",
                      selectedCategories.includes(item.id)
                        ? "ring-2 ring-primary ring-offset-2"
                        : "border border-input hover:border-primary/50",
                    )}
                    style={{
                      backgroundImage: item.image ? `url(${item.image})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Overlay */}
                    <div className={cn(
                      "absolute inset-0 transition-colors",
                      selectedCategories.includes(item.id)
                        ? "bg-black/40"
                        : "bg-black/50 group-hover:bg-black/60",
                    )} />
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-3">
                      <span className="text-lg mb-1">{item.icon}</span>
                      <p className="font-semibold text-white text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-white/80 text-xs">
                        {item.creatorCount.toLocaleString()} creators
                      </p>
                    </div>
                    
                    {/* Selected indicator */}
                    {selectedCategories.includes(item.id) && (
                      <div className="absolute top-2 right-2 z-20">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Icons.Check size={12} className="text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </button>
                ))
              : creators.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleCreatorToggle(item.id)}
                    className={cn(
                      "p-4 border rounded-lg text-left transition-colors",
                      selectedCreators.includes(item.id)
                        ? "border-primary bg-primary/10"
                        : "border-input hover:border-primary/50",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icons.Users size={20} className="text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.channelName}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {formatNumber(item.subscriberCount)} subscribers
                        </p>
                      </div>
                      {selectedCreators.includes(item.id) && (
                        <Icons.Check size={18} className="text-primary flex-shrink-0" />
                      )}
                    </div>
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
              <label className="block text-sm font-medium text-foreground mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your campaign"
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                rows={3}
              />
            </div>
          </div>

          {/* Video Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Upload Video (Max 30 secs)
            </label>

            {/* Video Preview */}
            {videoPreview ? (
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-h-80 mx-auto"
                  poster=""
                />
                <button
                  onClick={removeVideo}
                  className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                >
                  <Icons.Close size={16} />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-white text-xs">
                  {videoDuration?.toFixed(1)}s / 30s
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-background relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Icons.Upload
                  className="mx-auto text-muted-foreground mb-2"
                  size={24}
                />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  MP4, MOV up to 50MB (Max 30 seconds)
                </p>
              </div>
            )}

            {/* Error Message */}
            {videoError && (
              <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
                <Icons.AlertCircle size={16} />
                {videoError}
              </div>
            )}

            {/* Uploaded File Info */}
            {videoFile && !videoError && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.Video size={16} />
                <span className="truncate">{videoFile.name}</span>
                <span className="text-xs">
                  ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
            )}
          </div>

          {/* Placement */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Placement
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
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:border-primary",
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
              label="Budget (USD)"
              type="number"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
              placeholder="Enter budget"
              leftIcon={
                <span className="text-muted-foreground dark:text-muted-foreground text-sm font-bold">
                  $
                </span>
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
              <label className="block text-sm font-medium text-foreground mb-2">
                Target Type
              </label>
              <div className="relative">
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as TargetType)}
                  className="w-full px-4 py-2.5 pr-10 border border-input rounded-lg appearance-none bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground"
                >
                  <option value="impressions">Impressions</option>
                  <option value="clicks">Clicks</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
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
          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <h4 className="font-medium text-foreground mb-2">
              Budget Estimate
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {calculateBudget().toLocaleString("en-ZA", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {durationDays}
                </p>
                <p className="text-sm text-muted-foreground">Days</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {(calculateBudget() / durationDays).toLocaleString("en-ZA", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">Daily Budget</p>
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
