// "use client"

// import { useState } from "react"
// // import { zodResolver } from "@/hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { zodResolver, z } from "zod"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { toast } from "@/hooks/use-toast"
// import { PlusCircle } from "lucide-react"
// // import { createPet } from "@/utils/api"

// const petFormSchema = z.object({
//   name: z.string().min(2, {
//     message: "Pet name must be at least 2 characters.",
//   }),
//   breed: z.string().min(2, {
//     message: "Breed must be at least 2 characters.",
//   }),
//   age: z.string().min(1, {
//     message: "Age is required",
//   }),
//   weight: z.string().min(1, {
//     message: "Weight is required",
//   }),
//   color: z.string().min(2, {
//     message: "Color must be at least 2 characters.",
//   }),
//   about: z.string().min(10, {
//     message: "About section must be at least 10 characters.",
//   }),
//   vaccinated: z.string(),
//   neutered: z.string(),
//   emergency_contact: z.string().min(10, {
//     message: "Emergency contact number is required",
//   }),
// })

// export function AddPetForm({ profileId, onSuccess }) {
//   const [open, setOpen] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [imagePreview, setImagePreview] = useState(null)

//   // const form = useForm({
//   //   resolver: zodResolver(petFormSchema),
//   //   defaultValues: {
//   //     name: "",
//   //     breed: "",
//   //     age: "",
//   //     weight: "",
//   //     color: "",
//   //     about: "",
//   //     vaccinated: "no",
//   //     neutered: "no",
//   //     emergency_contact: "",
//   //   },
//   // })

//   async function onSubmit(data) {
//     try {
//       setIsSubmitting(true)
//       const formData = new FormData()

//       // Add form fields to FormData
//       Object.entries(data).forEach(([key, value]) => {
//         formData.append(key, value)
//       })

//       // Add profile ID
//       formData.append("profile", profileId)

//       // Add image if exists
//       const fileInput = document.querySelector('input[type="file"]')
//       if (fileInput?.files?.[0]) {
//         formData.append("image", fileInput.files[0])
//       }

//       // Convert boolean strings to actual booleans
//       formData.set("vaccinated", data.vaccinated === "yes")
//       formData.set("neutered", data.neutered === "yes")

//       await createPet(formData)

//       toast({
//         title: "Pet added successfully!",
//         description: `Added ${data.name} to your profile.`,
//       })

//       setOpen(false)
//       form.reset()
//       setImagePreview(null)
//       if (onSuccess) onSuccess()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to add pet. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleImageChange = (event) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setImagePreview(reader.result)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="gap-2">
//           <PlusCircle className="h-4 w-4" />
//           Add Pet
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Add New Pet</DialogTitle>
//           <DialogDescription>Add your pet's information. Click save when you're done.</DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           {/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> */}
//             <div className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Pet Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter pet name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="grid gap-4 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="breed"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Breed</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter breed" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="age"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Age</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter age" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="weight"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Weight (lbs)</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter weight" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="color"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Color</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter color" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="about"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>About</FormLabel>
//                     <FormControl>
//                       <Textarea placeholder="Tell us about your pet..." {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="space-y-4">
//                 <FormLabel>Pet Image</FormLabel>
//                 <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
//                 {imagePreview && (
//                   <div className="mt-2">
//                     <img
//                       src={imagePreview || "/placeholder.svg"}
//                       alt="Preview"
//                       className="w-32 h-32 object-cover rounded-lg"
//                     />
//                   </div>
//                 )}
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="vaccinated"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Vaccinated</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="yes">Yes</SelectItem>
//                           <SelectItem value="no">No</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="neutered"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Neutered</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="yes">Yes</SelectItem>
//                           <SelectItem value="no">No</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="emergency_contact"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Emergency Contact Number</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter emergency contact number" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="flex justify-end gap-4">
//               <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? "Saving..." : "Save Pet"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   )
// }

