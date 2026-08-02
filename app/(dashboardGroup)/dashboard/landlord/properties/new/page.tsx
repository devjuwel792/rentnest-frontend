import PropertyForm from "../../../../_components/landlord/PropertyForm";

const NewPropertyPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add a property</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to list your property.
        </p>
      </div>
      <PropertyForm />
    </div>
  );
};

export default NewPropertyPage;
