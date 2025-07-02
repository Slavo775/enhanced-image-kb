"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Slider } from "./ui/slider"
import { Label } from "./ui/label"
import { useToast } from "./ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { useInstagramEditor } from "../hooks/useInstagramEditor"
import { useInstagramExport } from "../hooks/useInstagramExport"
import { AspectRatio } from "./ui/aspect-ratio"
import { ImageIcon } from "@radix-ui/react-icons"
import { Skeleton } from "./ui/skeleton"
import { Progress } from "./ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { useScreenshot } from "use-screenshot-hook"
import { saveAs } from "file-saver"
import { ModeToggle } from "./ModeToggle"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { Icons } from "./icons"
import { v4 as uuidv4 } from "uuid"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { generatePrompt } from "../lib/prompt"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { countries } from "../data/countries"
import type { Country } from "../types"

type InstagramEditorProps = {}

const formSchema = z.object({
  country: z.string({
    required_error: "Please select a country.",
  }),
  tone: z.string().optional(),
  occasion: z.string().optional(),
  keywords: z.string().optional(),
})

const InstagramEditor: React.FC<InstagramEditorProps> = () => {
  const {
    image,
    setImage,
    brightness,
    setBrightness,
    contrast,
    setContrast,
    saturation,
    setSaturation,
    isGenerating,
    setIsGenerating,
    generatedPost,
    setGeneratedPost,
  } = useInstagramEditor()
  const { isLoading, setIsLoading, progress, setProgress, exportImage } = useInstagramExport()
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState(true)
  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isImageUploaded, setIsImageUploaded] = useState(false)
  const [isPostGenerated, setIsPostGenerated] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [postId, setPostId] = useState<string | null>(null)

  const { ref, takeScreenshot } = useScreenshot()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      tone: "",
      occasion: "",
      keywords: "",
    },
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setIsImageUploaded(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBrightnessChange = useCallback(
    (value: number) => {
      setBrightness(value)
    },
    [setBrightness],
  )

  const handleContrastChange = useCallback(
    (value: number) => {
      setContrast(value)
    },
    [setContrast],
  )

  const handleSaturationChange = useCallback(
    (value: number) => {
      setSaturation(value)
    },
    [setSaturation],
  )

  const handleReset = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setImage(null)
    setGeneratedPost(null)
    setIsImageUploaded(false)
    setIsPostGenerated(false)
    form.reset()
    setIsResetDialogOpen(false)
    setPostId(null)
  }

  const handleGeneratePost = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true)
    setIsPostGenerated(false)
    setGeneratedPost(null)
    setPostId(uuidv4())

    try {
      const prompt = generatePrompt(values.country, values.tone, values.occasion, values.keywords)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`)
      }

      setGeneratedPost(data.result)
      setIsPostGenerated(true)
      toast({
        title: "Post generated!",
        description: "Your Instagram post has been generated successfully.",
      })
    } catch (error: any) {
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExport = async () => {
    if (!image) {
      toast({
        title: "No image to export!",
        description: "Please upload an image first.",
      })
      return
    }

    setIsLoading(true)
    setProgress(0)

    try {
      const dataUrl = await takeScreenshot(ref.current as HTMLElement)
      if (dataUrl) {
        saveAs(dataUrl, "instagram-post.png")
        toast({
          title: "Image exported!",
          description: "Your Instagram post has been exported successfully.",
        })
      }
    } catch (error) {
      console.error("Failed to export image:", error)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem exporting your image. Please try again.",
      })
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const handleCopyToClipboard = () => {
    if (generatedPost) {
      navigator.clipboard.writeText(generatedPost)
      setIsCopied(true)
      toast({
        title: "Post copied!",
        description: "Your Instagram post has been copied to clipboard.",
      })
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }
  }

  return (
    <div className="container relative flex h-screen max-w-[800px] flex-col items-center justify-center gap-4 p-4">
      <ModeToggle />
      <Card className="w-full max-w-[800px]">
        <CardHeader>
          <CardTitle>Instagram Editor</CardTitle>
          <CardDescription>Create stunning Instagram posts with ease.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <AspectRatio ratio={1 / 1} className="w-[300px]">
              <div
                ref={ref}
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                }}
                className="relative flex items-center justify-center overflow-hidden rounded-md shadow-md"
              >
                {image ? (
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Uploaded"
                    className="object-cover"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : (
                  <Skeleton className="h-full w-full" />
                )}
                {isLoading ? <Progress className="absolute bottom-0 left-0 w-full" value={progress} /> : null}
              </div>
            </AspectRatio>

            <Input type="file" id="upload" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <Button asChild variant="outline">
              <label htmlFor="upload" className="cursor-pointer">
                {image ? (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Change Image
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Upload Image
                  </>
                )}
              </label>
            </Button>
          </div>

          <Separator />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGeneratePost)} className="grid gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>This is the country where the post will be published.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tone" {...field} />
                    </FormControl>
                    <FormDescription>What is the tone of the post? (e.g. funny, serious, etc.)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occasion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occasion</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter occasion" {...field} />
                    </FormControl>
                    <FormDescription>What is the occasion? (e.g. birthday, anniversary, etc.)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter keywords" {...field} />
                    </FormControl>
                    <FormDescription>Enter some keywords to help generate the post.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!isImageUploaded || isGenerating}>
                {isGenerating ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Post"
                )}
              </Button>
            </form>
          </Form>

          <Separator />

          {isPostGenerated && generatedPost && postId ? (
            <div className="relative">
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">{generatedPost}</ScrollArea>
              <Button
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={handleCopyToClipboard}
                disabled={isCopied}
              >
                {isCopied ? (
                  <>
                    <Icons.copied className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Icons.copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          ) : null}

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="brightness">Brightness</Label>
              <Input
                type="number"
                id="brightness-value"
                value={brightness}
                className="w-16 text-right"
                onChange={(e) => setBrightness(Number(e.target.value))}
              />
            </div>
            <Slider
              id="brightness"
              defaultValue={[brightness]}
              max={200}
              min={0}
              step={1}
              onValueChange={(value) => handleBrightnessChange(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contrast">Contrast</Label>
              <Input
                type="number"
                id="contrast-value"
                value={contrast}
                className="w-16 text-right"
                onChange={(e) => setContrast(Number(e.target.value))}
              />
            </div>
            <Slider
              id="contrast"
              defaultValue={[contrast]}
              max={200}
              min={0}
              step={1}
              onValueChange={(value) => handleContrastChange(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="saturation">Saturation</Label>
              <Input
                type="number"
                id="saturation-value"
                value={saturation}
                className="w-16 text-right"
                onChange={(e) => setSaturation(Number(e.target.value))}
              />
            </div>
            <Slider
              id="saturation"
              defaultValue={[saturation]}
              max={200}
              min={0}
              step={1}
              onValueChange={(value) => handleSaturationChange(value[0])}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Reset</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all the settings and clear the image. You will not be able to undo this action.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Icons.download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default InstagramEditor
