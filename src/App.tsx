import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Welcome to keepit</CardTitle>
          <CardDescription>
            Your project is ready to go!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Start building your app by adding components. Run:
          </p>
          <code className="block mt-2 p-2 bg-gray-100 rounded text-sm">
            npx shadcn@latest add [component-name]
          </code>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Learn More</Button>
          <Button>Get Started</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default App