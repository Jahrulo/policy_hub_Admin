import { Card, CardContent, CardHeader } from "../../../components/ui/card";
export const CardWrapper = ({ children, headerLabel }) => {
  return (
    <Card className="w-full max-w-md md:max-w-lg bg-transparent">
      <CardHeader>
        <div className="w-full flex flex-col items-start gap-4">
          {/* Header Label */}
          <h2 className="text-4xl font-semibold text-left text-[#008080]">
            {headerLabel}
          </h2>

          {/* Subtitle */}
          <p className="text-[20px] text-gray-600 font-light text-left">
            Please Login Here
          </p>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
