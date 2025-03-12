import React from 'react';
import { useRouter } from 'next/router';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Building, Language } from '@/types';
import { Plus, X, Upload } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface BuildingFormProps {
  initialData?: Building;
  language: Language;
}

const BuildingForm: React.FC<BuildingFormProps> = ({ initialData, language }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [eras, setEras] = React.useState([]);
  const [regions, setRegions] = React.useState([]);
  const [buildingTypes, setBuildingTypes] = React.useState([]);
  const [materials, setMaterials] = React.useState([]);

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      translations: {
        en: {
          title: '',
          alternateNames: [],
          location: '',
          overview: '',
          architecturalDetails: [],
          architectName: ''
        },
        ku: {
          title: '',
          alternateNames: [],
          location: '',
          overview: '',
          architecturalDetails: [],
          architectName: ''
        }
      },
      coordinates: {
        lat: 0,
        lng: 0
      },
      eraId: '',
      regionId: '',
      buildingTypeId: '',
      materialIds: [],
      status: '',
      constructionYear: null,
      renovationYears: [],
      images: []
    }
  });

  React.useEffect(() => {
    const fetchFormData = async () => {
      try {
        // Fetch related data
        const [erasRes, regionsRes, typesRes, materialsRes] = await Promise.all([
          fetch('/api/eras'),
          fetch('/api/regions'),
          fetch('/api/building-types'),
          fetch('/api/materials')
        ]);

        const [erasData, regionsData, typesData, materialsData] = await Promise.all([
          erasRes.json(),
          regionsRes.json(),
          typesRes.json(),
          materialsRes.json()
        ]);

        setEras(erasData);
        setRegions(regionsData);
        setBuildingTypes(typesData);
        setMaterials(materialsData);
      } catch (error) {
        console.error('Failed to fetch form data:', error);
      }
    };

    fetchFormData();
  }, []);

  const translations = {
    en: {
      basicInfo: "Basic Information",
      title: "Title",
      location: "Location",
      overview: "Overview",
      architecturalDetails: "Architectural Details",
      addDetail: "Add Detail",
      specificInfo: "Specific Information",
      era: "Historical Era",
      region: "Region",
      buildingType: "Building Type",
      materials: "Materials",
      status: "Status",
      constructionYear: "Construction Year",
      renovationYears: "Renovation Years",
      addYear: "Add Year",
      architect: "Architect",
      images: "Images",
      sources: "Sources",
      sourceTitle: "Source Title",
      sourceUrl: "Source URL",
      addSource: "Add Source",
      save: "Save Building",
      saving: "Saving...",
      required: "This field is required"
    },
    ku: {
      basicInfo: "زانیاری سەرەتایی",
      title: "ناونیشان",
      location: "شوێن",
      overview: "پوختە",
      architecturalDetails: "وردەکاری تەلارسازی",
      addDetail: "زیادکردنی وردەکاری",
      specificInfo: "زانیاری تایبەت",
      era: "سەردەمی مێژوویی",
      region: "ناوچە",
      buildingType: "جۆری بینا",
      materials: "کەرەستەکان",
      status: "دۆخ",
      constructionYear: "ساڵی دروستکردن",
      renovationYears: "ساڵەکانی نۆژەنکردنەوە",
      addYear: "زیادکردنی ساڵ",
      architect: "ئەندازیار",
      images: "وێنەکان",
      sources: "سەرچاوەکان",
      sourceTitle: "ناونیشانی سەرچاوە",
      sourceUrl: "بەستەری سەرچاوە",
      addSource: "زیادکردنی سەرچاوە",
      save: "پاشەکەوتکردنی بینا",
      saving: "پاشەکەوت دەکرێت...",
      required: "ئەم خانەیە پێویستە"
    }
  };

  const { fields: architecturalDetailsEn, append: appendDetailEn, remove: removeDetailEn } = 
    useFieldArray({
      control,
      name: 'translations.en.architecturalDetails'
    });

  const { fields: architecturalDetailsKu, append: appendDetailKu, remove: removeDetailKu } = 
    useFieldArray({
      control,
      name: 'translations.ku.architecturalDetails'
    });

  const { fields: renovationYears, append: appendYear, remove: removeYear } = 
    useFieldArray({
      control,
      name: 'renovationYears'
    });

  const { fields: sources, append: appendSource, remove: removeSource } = 
    useFieldArray({
      control,
      name: 'sources'
    });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch(
        initialData ? `/api/buildings/${initialData.id}` : '/api/buildings',
        {
          method: initialData ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save building');
      }

      router.push('/admin/buildings');
    } catch (error) {
      console.error('Failed to save building:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* English Form */}
        <div className="space-y-6 border-4 border-black p-6">
          <h2 className="text-2xl font-mono mb-4">{translations.en.basicInfo}</h2>
          
          <div>
            <label className="block font-mono mb-2">{translations.en.title}</label>
            <input
              {...register('translations.en.title', { required: true })}
              className="w-full border-2 border-black p-2"
            />
            {errors.translations?.en?.title && (
              <span className="text-red-500 text-sm">{translations.en.required}</span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">{translations.en.location}</label>
            <input
              {...register('translations.en.location', { required: true })}
              className="w-full border-2 border-black p-2"
            />
            {errors.translations?.en?.location && (
              <span className="text-red-500 text-sm">{translations.en.required}</span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">{translations.en.overview}</label>
            <textarea
              {...register('translations.en.overview', { required: true })}
              className="w-full border-2 border-black p-2 h-32"
            />
            {errors.translations?.en?.overview && (
              <span className="text-red-500 text-sm">{translations.en.required}</span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">{translations.en.architecturalDetails}</label>
            {architecturalDetailsEn.map((field, index) => (
              <div key={field.id} className="flex gap-4 mb-4">
                <input
                  {...register(`translations.en.architecturalDetails.${index}`)}
                  placeholder="Detail"
                  className="flex-1 border-2 border-black p-2"
                />
                <button
                  type="button"
                  onClick={() => removeDetailEn(index)}
                  className="p-2 hover:bg-black hover:text-white border-2 border-black"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendDetailEn('')}
              className="flex items-center gap-2 border-2 border-black p-2 hover:bg-black hover:text-white"
            >
              <Plus size={20} />
              {translations.en.addDetail}
            </button>
          </div>

          <div>
            <label className="block font-mono mb-2">{translations.en.architect}</label>
            <input
              {...register('translations.en.architectName')}
              className="w-full border-2 border-black p-2"
            />
          </div>
        </div>

        {/* Kurdish Form */}
        <div className="space-y-6 border-4 border-black p-6" dir="rtl">
          <h2 className="text-2xl font-mono mb-4">{translations.ku.basicInfo}</h2>
          
          <div>
            <label className="block font-mono mb-2">{translations.ku.title}</label>
            <input
              {...register('translations.ku.title', { required: true })}
              className="w-full border-2 border-black p-2"
            />
            {errors.translations?.ku?.title && (
              <span className="text-red-500 text-sm">{translations.ku.required}</span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">{translations.ku.location}</label>
            <input
              {...register('translations.ku.location', { required: true })}
              className="w-full border-2 border-black p-2"
            />
            {errors.translations?.ku?.location && (
              <span className="text-red-500 text-sm">{translations.ku.required}</span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">{translations.ku.overview}</label>
            <textarea
              {...register('translations.ku.overview', { required: true })}
              className="w-full border-2 border-black p-2 h-32"
            />
            {errors.translations?.ku?.overview && (
              <span className="text-red-500 text-sm">{translations.ku.required}</span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">{translations.ku.architecturalDetails}</label>
            {architecturalDetailsKu.map((field, index) => (
              <div key={field.id} className="flex gap-4 mb-4">
                <input
                  {...register(`translations.ku.architecturalDetails.${index}`)}
                  placeholder="وردەکاری"
                  className="flex-1 border-2 border-black p-2"
                />
                <button
                  type="button"
                  onClick={() => removeDetailKu(index)}
                  className="p-2 hover:bg-black hover:text-white border-2 border-black"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendDetailKu('')}
              className="flex items-center gap-2 border-2 border-black p-2 hover:bg-black hover:text-white"
            >
              <Plus size={20} />
              {translations.ku.addDetail}
            </button>
          </div>

          <div>
            <label className="block font-mono mb-2">{translations.ku.architect}</label>
            <input
              {...register('translations.ku.architectName')}
              className="w-full border-2 border-black p-2"
            />
          </div>
        </div>
      </div>

      {/* Specific Information */}
      <div className="border-4 border-black p-6 space-y-6">
        <h2 className="text-2xl font-mono mb-4">
          {language === 'en' ? translations.en.specificInfo : translations.ku.specificInfo}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label className="block font-mono mb-2">
              {language === 'en' ? translations.en.era : translations.ku.era}
            </label>
            <select
              {...register('eraId', { required: true })}
              className="w-full border-2 border-black p-2"
            >
              <option value="">--{language === 'en' ? 'Select Era' : 'هەڵبژاردنی سەردەم'}--</option>
              {eras.map(era => (
                <option key={era.id} value={era.id}>
                  {language === 'en' ? era.nameEn : era.nameKu}
                </option>
              ))}
            </select>
            {errors.eraId && (
              <span className="text-red-500 text-sm">
                {language === 'en' ? translations.en.required : translations.ku.required}
              </span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">
              {language === 'en' ? translations.en.region : translations.ku.region}
            </label>
            <select
              {...register('regionId', { required: true })}
              className="w-full border-2 border-black p-2"
            >
              <option value="">--{language === 'en' ? 'Select Region' : 'هەڵبژاردنی ناوچە'}--</option>
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {language === 'en' ? region.nameEn : region.nameKu}
                </option>
              ))}
            </select>
            {errors.regionId && (
              <span className="text-red-500 text-sm">
                {language === 'en' ? translations.en.required : translations.ku.required}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label className="block font-mono mb-2">
              {language === 'en' ? translations.en.buildingType : translations.ku.buildingType}
            </label>
            <select
              {...register('buildingTypeId', { required: true })}
              className="w-full border-2 border-black p-2"
            >
              <option value="">--{language === 'en' ? 'Select Type' : 'هەڵبژاردنی جۆر'}--</option>
              {buildingTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {language === 'en' ? type.nameEn : type.nameKu}
                </option>
              ))}
            </select>
            {errors.buildingTypeId && (
              <span className="text-red-500 text-sm">
                {language === 'en' ? translations.en.required : translations.ku.required}
              </span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">
              {language === 'en' ? translations.en.status : translations.ku.status}
            </label>
            <select
              {...register('status', { required: true })}
              className="w-full border-2 border-black p-2"
            >
              <option value="">--{language === 'en' ? 'Select Status' : 'هەڵبژاردنی دۆخ'}--</option>
              <option value="PRESERVED">
                {language === 'en' ? 'Preserved' : 'پارێزراو'}
              </option>
              <option value="ENDANGERED">
                {language === 'en' ? 'Endangered' : 'لە مەترسیدا'}
              </option>
              <option value="RESTORED">
                {language === 'en' ? 'Restored' : 'نۆژەنکراوەتەوە'}
              </option>
              <option value="RUINS">
                {language === 'en' ? 'Ruins' : 'کاولبوو'}
              </option>
            </select>
            {errors.status && (
              <span className="text-red-500 text-sm">
                {language === 'en' ? translations.en.required : translations.ku.required}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label className="block font-mono mb-2">
              {language === 'en' ? translations.en.constructionYear : translations.ku.constructionYear}
            </label>
            <input
              type="number"
              {...register('constructionYear', { valueAsNumber: true })}
              className="w-full border-2 border-black p-2"
            />
          </div>

          <div>
            <label className="block font-mono mb-2">
              {language === 'en' ? translations.en.renovationYears : translations.ku.renovationYears}
            </label>
            {renovationYears.map((field, index) => (
              <div key={field.id} className="flex gap-4 mb-4">
                <input
                  type="number"
                  {...register(`renovationYears.${index}`, { valueAsNumber: true })}
                  className="flex-1 border-2 border-black p-2"
                />
                <button
                  type="button"
                  onClick={() => removeYear(index)}
                  className="p-2 hover:bg-black hover:text-white border-2 border-black"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendYear('')}
              className="flex items-center gap-2 border-2 border-black p-2 hover:bg-black hover:text-white"
            >
              <Plus size={20} />
              {language === 'en' ? translations.en.addYear : translations.ku.addYear}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-mono mb-2">
            {language === 'en' ? translations.en.materials : translations.ku.materials}
          </label>
          <Controller
            control={control}
            name="materialIds"
            render={({ field }) => (
              <div className="border-2 border-black p-2">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {materials.map(material => (
                    <label 
                      key={material.id} 
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={material.id}
                        checked={field.value.includes(material.id)}
                        onChange={(e) => {
                          const value = material.id;
                          if (e.target.checked) {
                            field.onChange([...field.value, value]);
                          } else {
                            field.onChange(field.value.filter(v => v !== value));
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span>{language === 'en' ? material.nameEn : material.nameKu}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          />
        </div>

        <div>
          <label className="block font-mono mb-2">
            {language === 'en' ? translations.en.images : translations.ku.images}
          </label>
          <ImageUpload
            onUpload={(urls) => {
              setValue('images', urls);
            }}
            language={language}
          />
        </div>

        <div>
          <label className="block font-mono mb-2">
            {language === 'en' ? translations.en.sources : translations.ku.sources}
          </label>
          {sources.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border-2 border-black p-4">
              <div>
                <label className="block font-mono mb-2">
                  {language === 'en' ? translations.en.sourceTitle : translations.ku.sourceTitle}
                </label>
                <input
                  {...register(`sources.${index}.title`)}
                  className="w-full border-2 border-black p-2"
                />
              </div>
              <div>
                <label className="block font-mono mb-2">
                  {language === 'en' ? translations.en.sourceUrl : translations.ku.sourceUrl}
                </label>
                <input
                  {...register(`sources.${index}.url`)}
                  className="w-full border-2 border-black p-2"
                />
              </div>
              <div className="flex justify-end md:col-span-2">
                <button
                  type="button"
                  onClick={() => removeSource(index)}
                  className="p-2 hover:bg-black hover:text-white border-2 border-black"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendSource({ title: '', url: '' })}
            className="flex items-center gap-2 border-2 border-black p-2 hover:bg-black hover:text-white"
          >
            <Plus size={20} />
            {language === 'en' ? translations.en.addSource : translations.ku.addSource}
          </button>
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
            ? (language === 'en' ? translations.en.saving : translations.ku.saving) 
            : (language === 'en' ? translations.en.save : translations.ku.save)}
        </button>
      </div>
    </form>
  );
};

export default BuildingForm;