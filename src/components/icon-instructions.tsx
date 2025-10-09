import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ras-sh/ui";
import { useState } from "react";
import { ShikiCodeBlock } from "~/components/shiki-code-block";
import { FRAMEWORK_EXAMPLES } from "~/lib/framework-examples";

export function IconInstructions() {
  const [activeTab, setActiveTab] = useState(FRAMEWORK_EXAMPLES[0]?.id || "");

  const getLanguage = (frameworkId: string) => {
    if (frameworkId === "html") {
      return "html";
    }
    if (frameworkId === "nuxt") {
      return "typescript";
    }
    return "tsx";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-semibold text-zinc-100">
          How to Use Your Icons
        </h3>
        <p className="text-sm text-zinc-400">
          Add these files to your project's public directory and use the code
          examples below.
        </p>
      </div>

      <Tabs
        className="space-y-6"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList>
          {FRAMEWORK_EXAMPLES.map((framework) => (
            <TabsTrigger key={framework.id} value={framework.id}>
              {framework.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {FRAMEWORK_EXAMPLES.map((framework) => (
          <TabsContent
            className="mt-0 space-y-4 data-[state=inactive]:hidden"
            forceMount
            key={framework.id}
            value={framework.id}
          >
            <div>
              <h4 className="mb-2 font-medium text-sm text-zinc-300">
                {framework.id === "html" ? "HTML Head Tags" : "Configuration"}
              </h4>
              <ShikiCodeBlock
                code={framework.htmlCode}
                language={getLanguage(framework.id)}
              />
            </div>

            <div>
              <h4 className="mb-2 font-medium text-sm text-zinc-300">
                Web Manifest (site.webmanifest)
              </h4>
              <ShikiCodeBlock code={framework.manifestCode} language="json" />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
