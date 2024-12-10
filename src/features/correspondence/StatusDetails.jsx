/* eslint-disable react/prop-types */
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import logo1 from "../../../public/logos/betterHealth.png";
import { useNavigate } from "react-router-dom";
import { useData } from "../../hooks/useData";
import {
  AlertCircle,
  FileChartLine,
  Search,
  UserRoundPlusIcon,
} from "lucide-react";
import Loading from "@/components/Loader";
import { Input } from "@/components/ui/input";
import AddCorresp from "./AddCorresp";

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

function currencyFormat(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "SLE",
  }).format(amount);
}

export default function StatusDetails({ userRole }) {
  const { data, loading, error } = useData();
  const { correspondences } = data;
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const canAddCorrespondence = userRole === "secretary";
  const navigate = useNavigate();

  const sections = [
    {
      type: "completed",
      name: "Completed Projects",
      title: "Completed Projects",
      filter: (item) =>
        item.is_ended === true && item.status.toLowerCase() === "completed",
    },
    {
      type: "pending",
      name: "Pending Projects",
      title: "Pending Projects",
      filter: (item) => item.status.toLowerCase() === "pending",
    },
    {
      type: "ongoing",
      name: "Ongoing Projects",
      title: "Ongoing Projects",
      filter: (item) => item.category.toLowerCase() === "in progress",
    },
    {
      type: "delayed",
      name: "Delayed Projects",
      title: "Delayed Projects",
      filter: (item) => item.category.toLowerCase() === "delayed",
    },
  ];

  const getColors = (type) => {
    switch (type) {
      case "completed":
        return {
          bg: "bg-bgSecondary",
          border: "border-bgPrimary",
          button: "bg-bgPrimary",
          dot: "bg-bgPrimary",
          text: "text-black",
        };
      case "pending":
        return {
          bg: "bg-[#FFCC000D]",
          border: "border-yellowBg",
          button: "bg-[#EFBE12]",
          dot: "bg-[#EFBE12]",
          text: "text-[#EFBE12]",
        };
      case "ongoing":
        return {
          bg: "bg-bgSecondary",
          border: "border-bluePrimary",
          button: "bg-bluePrimary",
          dot: "bg-sky-400",
          text: "text-sky-600",
        };
      case "delayed":
        return {
          bg: "bg-[#F45B690D]",
          border: "border-[#F45B69]",
          button: "bg-[#F45B69]",
          dot: "bg-[#F45B69]",
          text: "text-[#F45B69]",
        };
      default:
        return {
          bg: "bg-teal-50",
          border: "border-teal-200",
          button: "bg-teal-600",
          dot: "bg-teal-500",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loading size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An unexpected error occurred. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      {/* Search Input */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 justify-between p-4">
          <div className="flex gap-4">
            {canAddCorrespondence && (
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-bgPrimary text-white"
                onClick={() => setShowForm(!showForm)}
              >
                <UserRoundPlusIcon className="h-4 w-4" />
                Add Correspondence
              </Button>
            )}

            {userRole === "admin" && (
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-bgPrimary text-white"
              >
                <FileChartLine className="h-4 w-4" />
                Generate Report
              </Button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title | donor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 font-normal"
            />
          </div>
        </div>

        {showForm && (
          <div className="w-full">
            <AddCorresp isOpen={showForm} onClose={() => setShowForm(false)} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 m-4">
        {sections.map((section) => {
          const colors = getColors(section.type);
          const filteredCorrespondences = correspondences
            .filter(section.filter)
            .filter(
              (item) =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.donor.toLowerCase().includes(searchTerm.toLowerCase())
            );

          return (
            <Card
              key={section.title}
              className={`bg-white border-2 ${colors.border} rounded-lg overflow-hidden`}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  <h2 className={`font-semibold text-lg`}>{section.name}</h2>
                </div>

                <Carousel className="w-full">
                  <CarouselContent>
                    {filteredCorrespondences.map((item, idx) => {
                      const imgUrlBlob = data.partners.find(
                        (partner) => partner.id === item.partner_id
                      ).icon;
                      const url = JSON.parse(imgUrlBlob)?.url;
                      return (
                        <CarouselItem key={idx}>
                          <div className="p-4 bg-[#A2A1A80D] rounded-md">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex flex-col items-start w-full gap-x-4">
                                <div className="relative flex-shrink-0">
                                  <img
                                    src={url || logo1}
                                    alt={item.sponsor}
                                    className="w-full h-full object-fill"
                                    style={{
                                      imageRendering:
                                        "-webkit-optimize-contrast",
                                      backfaceVisibility: "hidden",
                                    }}
                                    loading="lazy"
                                  />
                                </div>

                                <div className="flex flex-col min-w-0 mt-2">
                                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                                    {item.donor}
                                  </h3>
                                  <p className="mt-1 text-sm font-medium text-gray-600">
                                    {currencyFormat(item.amount)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col space-y-4">
                              <p className="mt-2 text-stone-700 text-sm font-bold">
                                <span>{item.title}</span>
                              </p>

                              <p
                                className={`text-xs font-light ${colors.text} ${colors.bg} p-2 rounded-md mt-2`}
                              >
                                {formatDateTime(item.created_at)}
                              </p>

                              {section.type === "ongoing" ? (
                                <p
                                  className={`text-xs font-normal ${colors.bg} w-fit ${colors.text} px-2 py-1 rounded-md border-1 mb-2 ${colors.border} text-left`}
                                >
                                  {`sent to ${item.sentTo} `}
                                </p>
                              ) : (
                                <p
                                  className={`text-xs font-normal ${colors.bg} w-fit ${colors.text} px-2 py-1 rounded-md border-1 mb-2 ${colors.border} text-left`}
                                >
                                  {item.status}
                                </p>
                              )}
                            </div>

                            <Button
                              onClick={() =>
                                navigate(
                                  `/dashboard/correspondences/details/${item.id}`
                                )
                              }
                              className={`mt-4 w-full py-2 rounded-lg text-white ${colors.button} hover:${colors.button}`}
                            >
                              {section.type === "delayed"
                                ? "Send Reminder"
                                : "View Details"}
                            </Button>
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  {filteredCorrespondences.length > 1 && (
                    <CarouselPrevious className="left-1 ml-[-18px]" />
                  )}
                  {filteredCorrespondences.length > 1 && (
                    <CarouselNext className="right-1 mr-[-18px]" />
                  )}
                </Carousel>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
