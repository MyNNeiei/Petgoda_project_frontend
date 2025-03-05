import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axios";

export default function AddPetForm({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    pettype: "", // ✅ Updated to use dropdown
    age: "",
    weight: "",
    height: "",
    allegic: "",
    properties: "",
    birth_date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log(formData)
      const response = await axiosInstance.post("api/pet/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast({
        title: "Success",
        description: "Pet added successfully",
      });

      setOpen(false);
      onSuccess();
      setFormData({
        name: "",
        pettype: "",
        age: "",
        weight: "",
        height: "",
        allegic: "",
        properties: "",
        birth_date: "",
      });
    } catch (error) {
      console.error("Error adding pet:", error);
      toast({
        title: "Error",
        description: "Failed to add pet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Pet
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#D2C8BC] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Pet</DialogTitle>
          <DialogDescription>
            Add your pet's information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Pet Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pettype">Type</Label>
              <select
                id="pettype"
                required
                value={formData.pettype}
                onChange={(e) => setFormData({ ...formData, pettype: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              >
                <option value="">Select Type</option>
                <option value="D">Dog</option>
                <option value="C">Cat</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth_date">Birth Date</Label>
              <Input
                id="birth_date"
                type="date"
                required
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              required
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allegic">Allergies</Label>
            <Textarea
              id="allegic"
              value={formData.allegic}
              onChange={(e) => setFormData({ ...formData, allegic: e.target.value })}
              placeholder="List any allergies..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="properties">Properties</Label>
            <Textarea
              id="properties"
              value={formData.properties}
              onChange={(e) => setFormData({ ...formData, properties: e.target.value })}
              placeholder="Any special characteristics..."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Pet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
