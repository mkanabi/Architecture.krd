import React from 'react';
import { useRouter } from 'next/router';
import { useForm, useFieldArray } from 'react-hook-form';
import { Building } from '@/types';
import { buildingsApi } from '@/lib/api';
import { Upload, Plus, X } from 'lucide-react';


type BuildingFormData = Omit<Building, 'id' | 'createdAt' | 'updatedAt'>;

interface BuildingFormProps {
  initialData?: Building;
}

const BuildingForm: React.FC<BuildingFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<BuildingFormData>({
    defaultValues: initialData || {
      translations: {
        en: {
          title: '',
          alternateNames: [],
          location: '',
          overview: '',
          architecturalDetails: [],
          historicalPeriods: []
        },
        ku: {
          title: '',
          alternateNames: [],
          location: '',
          overview: '',
          architecturalDetails: [],
          historicalPeriods: []
        }
      },
      coordinates: {
        lat: 0,
        lng: 0
      },
      period: '',
      status: '',
      images: []
    }
  });

  const { fields: historicalPeriodsEn, append: appendPeriodEn, remove: removePeriodEn } = 
    useFieldArray({
      control,
      name: 'translations.en.historicalPeriods'
    });

  const { fields: historicalPeriodsKu, append: appendPeriodKu, remove: removePeriodKu } = 
    useFieldArray({
      control,
      name: 'translations.ku.historicalPeriods'
    });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    try {
      // This would be replaced with your actual image upload logic
      const uploadedUrls = ['/api/placeholder/400/300'];
      
      // Add new images to the form
      const currentImages = watch('images');
      setValue('images', [...currentImages, ...uploadedUrls]);
    } catch (error) {
      console.error('Failed to upload images:', error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: BuildingFormData) => {
    try {
      if (initialData) {
        await buildingsApi.update(initialData.id, data);
      } else {
        await buildingsApi.create(data);
      }
      router.push('/admin/buildings');
    } catch (error) {
      console.error('Failed to save building:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        {/* English Form */}
        <div className="space-y-6 border-4 border-black p-6">
          <h2 className="text-2xl font-mono mb-4">English Details</h2>
          
          <div>
            <label className="block font-mono mb-2">Title</label>
            <input
              {...register('translations.en.title', { required: true })}
              className="w-full border-2 border-black p-2"
            />
          </div>

          <div>
            <label className="block font-mono mb-2">Location</label>
            <input
              {...register('translations.en.location', { required: true })}
              className="w-full border-2 border-black p-2"
            />
          </div>

          <div>
            <label className="block font-mono mb-2">Overview</label>
            <textarea
              {...register('translations.en.overview', { required: true })}
              className="w-full border-2 border-black p-2 h-32"
            />
          </div>

          <div>
            <label className="block font-mono mb-2">Historical Periods</label>
            {historicalPeriodsEn.map((field, index) => (
              <div key={field.id} className="flex gap-4 mb-4">
                <input
                  {...register(`translations.en.historicalPeriods.${index}.era`)}
                  placeholder="Era"
                  className="flex-1 border-2 border-black p-2"
                />
                <input
                  {...register(`translations.en.historicalPeriods.${index}.details`)}
                  placeholder="Details"
                  className="flex-1 border-2 border-black p-2"
                />
                <button
                  type="button"
                  onClick={() => removePeriodEn(index)}
                  className="p-2 hover:bg-black hover:text-white border-2 border-black"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendPeriodEn({ era: '', details: '' })}
              className="flex items-center gap-2 border-2 border-black p-2 hover:bg-black hover:text-white"
            >
              <Plus size={20} />
              Add Period
            </button>
          </div>
        </div>

        {/* Kurdish Form */}
        <div className="space-y-6 border-4 border-black p-6" dir="rtl">
          <h2 className="text-2xl font-mono mb-4">وردەکارییەکان بە کوردی</h2>
          
          {/* Similar fields as English but with Kurdish labels */}
          {/* ... */}
        </div>
      </div>

      {/* Common Fields */}
      <div className="border-4 border-black p-6 space-y-6">
        <h2 className="text-2xl font-mono mb-4">Common Details</h2>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block font-mono mb-2">Period</label>
            <input
              {...register('period', { required: true })}
              className="w-full border-2 border-black p-2"
            />
          </div>

          <div>
            <label className="block font-mono mb-2">Status</label>
            <input
              {...register('status', { required: true })}
              className="w-full border-2 border-black p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block font-mono mb-2">Latitude</label>
            <input
              type="number"
              step="any"
              {...register('coordinates.lat', { required: true })}
              className="w-full border-2 border-black p-2"
            />
          </div>

          <div>
            <label className="block font-mono mb-2">Longitude</label>
            <input
              type="number"
              step="any"
              {...register('coordinates.lng', { required: true })}
              className="w-full border-2 border-black p-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono mb-2">Images</label>
          <div className="border-2 border-black p-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center gap-2 cursor-pointer hover:bg-black hover:text-white p-2 inline-block"
            >
              <Upload size={20} />
              Upload Images
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-black text-white px-8 py-3 hover:bg-white hover:text-black border-2 border-black transition-colors"
        >
          {initialData ? 'Update Building' : 'Create Building'}
        </button>
      </div>
    </form>
  );
};

export default BuildingForm;