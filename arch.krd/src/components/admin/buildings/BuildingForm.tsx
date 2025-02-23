import React from 'react';
import { useRouter } from 'next/router';
import { useForm, useFieldArray } from 'react-hook-form';
import { Building } from '@/types';
import { buildingsApi } from '@/lib/api';
import { Upload, Plus, X } from 'lucide-react';
import ImageUpload from '../ImageUpload.tsx';

type BuildingFormData = Omit<Building, 'id' | 'createdAt' | 'updatedAt'>;

interface BuildingFormProps {
  initialData?: Building;
}

const BuildingForm: React.FC<BuildingFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<BuildingFormData>({
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

  const formErrors = {
    en: {
      required: "This field is required",
      invalid: "Invalid input"
    },
    ku: {
      required: "ئەم خانەیە پێویستە",
      invalid: "داخڵکردنی نادروست"
    }
  };
  const onSubmit = async (data: BuildingFormData) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting form data:', data);
  
      if (initialData) {
        await buildingsApi.update(initialData.id, data);
      } else {
        await buildingsApi.create(data);
      }
      
      router.push('/admin/buildings');
    } catch (error) {
      console.error('Form submission error:', error);
      // Show error to user
      setError(error instanceof Error ? error.message : 'Failed to save building');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* English Form */}
        <div className="space-y-6 border-4 border-black p-6">
          <h2 className="text-2xl font-mono mb-4">English Details</h2>
          
          <div>
            <label className="block font-mono mb-2">Title</label>
            <input
              {...register('translations.en.title', { required: true })}
              className="w-full border-2 border-black p-2"
            />
            {errors.translations?.en?.title && (
              <span className="text-red-500 text-sm">{formErrors.en.required}</span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">Location</label>
            <input
              {...register('translations.en.location', { required: true })}
              className="w-full border-2 border-black p-2"
            />
            {errors.translations?.en?.location && (
              <span className="text-red-500 text-sm">{formErrors.en.required}</span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">Overview</label>
            <textarea
              {...register('translations.en.overview', { required: true })}
              className="w-full border-2 border-black p-2 h-32"
            />
            {errors.translations?.en?.overview && (
              <span className="text-red-500 text-sm">{formErrors.en.required}</span>
            )}
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
          
          <div>
            <label className="block font-mono mb-2">ناونیشان</label>
            <input
              {...register('translations.ku.title', { required: true })}
              className="w-full border-2 border-black p-2"
            />
            {errors.translations?.ku?.title && (
              <span className="text-red-500 text-sm">{formErrors.ku.required}</span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">شوێن</label>
            <input
              {...register('translations.ku.location', { required: true })}
              className="w-full border-2 border-black p-2"
            />
            {errors.translations?.ku?.location && (
              <span className="text-red-500 text-sm">{formErrors.ku.required}</span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">پوختە</label>
            <textarea
              {...register('translations.ku.overview', { required: true })}
              className="w-full border-2 border-black p-2 h-32"
            />
            {errors.translations?.ku?.overview && (
              <span className="text-red-500 text-sm">{formErrors.ku.required}</span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">سەردەمە مێژووییەکان</label>
            {historicalPeriodsKu.map((field, index) => (
              <div key={field.id} className="flex gap-4 mb-4">
                <input
                  {...register(`translations.ku.historicalPeriods.${index}.era`)}
                  placeholder="سەردەم"
                  className="flex-1 border-2 border-black p-2"
                />
                <input
                  {...register(`translations.ku.historicalPeriods.${index}.details`)}
                  placeholder="وردەکاری"
                  className="flex-1 border-2 border-black p-2"
                />
                <button
                  type="button"
                  onClick={() => removePeriodKu(index)}
                  className="p-2 hover:bg-black hover:text-white border-2 border-black"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendPeriodKu({ era: '', details: '' })}
              className="flex items-center gap-2 border-2 border-black p-2 hover:bg-black hover:text-white"
            >
              <Plus size={20} />
              زیادکردنی سەردەم
            </button>
          </div>
        </div>
      </div>

      {/* Common Fields */}
      <div className="border-4 border-black p-6 space-y-6">
        <h2 className="text-2xl font-mono mb-4">Common Details</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label className="block font-mono mb-2">Period</label>
            <input
              {...register('period', { required: true })}
              className="w-full border-2 border-black p-2"
            />
            {errors.period && (
              <span className="text-red-500 text-sm">{formErrors.en.required}</span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">Status</label>
            <input
              {...register('status', { required: true })}
              className="w-full border-2 border-black p-2"
            />
            {errors.status && (
              <span className="text-red-500 text-sm">{formErrors.en.required}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <div>
    <label className="block font-mono mb-2">Latitude</label>
    <input
      type="number"
      step="any"
      {...register('coordinates.lat', { 
        required: true,
        valueAsNumber: true,
        validate: (value) => !isNaN(value) || 'Please enter a valid number'
      })}
      className="w-full border-2 border-black p-2"
    />
    {errors.coordinates?.lat && (
      <span className="text-red-500 text-sm">{formErrors.en.required}</span>
    )}
  </div>

  <div>
    <label className="block font-mono mb-2">Longitude</label>
    <input
      type="number"
      step="any"
      {...register('coordinates.lng', { 
        required: true,
        valueAsNumber: true,
        validate: (value) => !isNaN(value) || 'Please enter a valid number'
      })}
      className="w-full border-2 border-black p-2"
    />
    {errors.coordinates?.lng && (
      <span className="text-red-500 text-sm">{formErrors.en.required}</span>
    )}
  </div>
</div>

        <div>
          <label className="block font-mono mb-2">Images</label>
          <ImageUpload
            onUpload={(urls) => {
              setValue('images', urls);
            }}
            language="en"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-black text-white px-8 py-3 hover:bg-white hover:text-black border-2 border-black transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting 
            ? (initialData ? 'Updating...' : 'Creating...') 
            : (initialData ? 'Update Building' : 'Create Building')}
        </button>
      </div>
    </form>
  );
};

export default BuildingForm;