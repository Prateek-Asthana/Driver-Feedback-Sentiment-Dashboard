import React, { useState, useMemo } from 'react';
import { useFeatureFlagStore } from '../store/featureFlagStore';
import { useSubmitFeedback, useFeedbackTags } from '../services/api';
import { useFormState } from '../hooks/index';
import StarRating from './StarRating';
import TagChips from './TagChips';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

/**
 * Configurable Feedback Form Component
 * Supports multiple entities (Driver, Trip, App, Marshal)
 * Feature flag-driven visibility
 * Inline validation, loading states, accessibility
 */

const ENTITY_CONFIG = {
  driver: {
    label: 'Driver Feedback',
    description: 'Tell us about your driver experience',
    color: 'primary',
  },
  trip: {
    label: 'Trip Feedback',
    description: 'How was your trip?',
    color: 'info',
  },
  app: {
    label: 'App Feedback',
    description: 'Tell us about the MoveInSync app',
    color: 'warning',
  },
  marshal: {
    label: 'Marshal Feedback',
    description: 'Share your experience with our marshal',
    color: 'success',
  },
};

const FeedbackForm = ({ tripId }) => {
  const featureFlags = useFeatureFlagStore((state) => state.featureFlags);
  const [activeEntity, setActiveEntity] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [entityFeedback, setEntityFeedback] = useState({});

  const submitMutation = useSubmitFeedback();

  // Get enabled entities
  const enabledEntities = useMemo(() => {
    return Object.entries(featureFlags)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => key.replace('Feedback', ''))
      .map((entity) => ({
        key: entity.toLowerCase(),
        ...ENTITY_CONFIG[entity.toLowerCase()],
      }));
  }, [featureFlags]);

  // Determine active entity (first enabled if not set)
  React.useEffect(() => {
    if (!activeEntity && enabledEntities.length > 0) {
      setActiveEntity(enabledEntities[0].key);
    }
  }, [enabledEntities, activeEntity]);

  const form = useFormState(
    {
      rating: 0,
      tags: [],
      text: '',
    },
    async (values) => {
      try {
        await submitMutation.mutateAsync({
          entity: activeEntity,
          tripId,
          ...values,
          timestamp: new Date(),
        });
        setSubmitSuccess(true);
        form.reset();
        setEntityFeedback({});
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
      } catch (error) {
        form.setFieldError('submit', error.message);
      }
    }
  );

  const feedbackTags = useFeedbackTags(activeEntity);

  // Character count for text area
  const characterCount = form.values.text.length;
  const maxCharacters = 500;

  // Check if form is valid
  const isFormValid =
    form.values.rating > 0 &&
    (form.values.text.length > 0 || form.values.tags.length > 0);

  // No feedback options
  if (enabledEntities.length === 0) {
    return (
      <div className="p-8 bg-slate-50 rounded-lg border border-slate-200 text-center">
        <AlertCircle className="mx-auto mb-2 text-slate-400" size={32} />
        <h3 className="text-lg font-semibold text-slate-700 mb-1">
          No Feedback Options Available
        </h3>
        <p className="text-slate-600">
          Feedback collection is currently disabled. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-success/10 border border-success rounded-lg flex gap-3">
          <CheckCircle className="text-success shrink-0" size={20} />
          <div>
            <p className="font-semibold text-success">Thanks for your feedback!</p>
            <p className="text-sm text-success/80">
              Your response has been recorded and will help us improve.
            </p>
          </div>
        </div>
      )}

      {/* Entity Selection Tabs - Only show if multiple entities */}
      {enabledEntities.length > 1 && (
        <div className="mb-6 border-b border-slate-200">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {enabledEntities.map((entity) => (
              <button
                key={entity.key}
                onClick={() => setActiveEntity(entity.key)}
                className={`
                  px-4 py-3 font-medium text-sm border-b-2 transition-colors
                  whitespace-nowrap
                  ${
                    activeEntity === entity.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }
                `}
              >
                {entity.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={form.handleSubmit} className="space-y-6">
        {/* Entity Header */}
        <div>
          <h2 className="text-2xl font-bold text-darker">
            {ENTITY_CONFIG[activeEntity]?.label}
          </h2>
          <p className="text-slate-600 mt-1">
            {ENTITY_CONFIG[activeEntity]?.description}
          </p>
        </div>

        {/* Progress Indicator - only for multi-step */}
        {enabledEntities.length > 1 && (
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  step <= 2 ? 'bg-primary' : 'bg-slate-200'
                }`}
              />
            ))}
            <span className="text-sm text-slate-600">
              {enabledEntities.findIndex((e) => e.key === activeEntity) + 1} of{' '}
              {enabledEntities.length}
            </span>
          </div>
        )}

        {/* Submit Error */}
        {form.errors.submit && (
          <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger text-sm">
            {form.errors.submit}
          </div>
        )}

        {/* Star Rating - Required */}
        <StarRating
          value={form.values.rating}
          onChange={(rating) => form.setValue('rating', rating)}
          label="How would you rate this?"
          required
          size="lg"
          ariaLabel={`Rate your ${activeEntity} experience`}
        />

        {/* Tag Selection - Optional */}
        {!feedbackTags.isLoading && (
          <TagChips
            tags={feedbackTags.data || []}
            selectedTags={form.values.tags}
            onTagSelect={(tag) =>
              form.setValue('tags', [...form.values.tags, tag])
            }
            onTagRemove={(tag) =>
              form.setValue(
                'tags',
                form.values.tags.filter((t) => t !== tag)
              )
            }
            label="Quick Feedback (Select up to 3)"
            maxTags={3}
            loading={feedbackTags.isLoading}
            error={feedbackTags.isError ? 'Could not load tags' : null}
            multiSelect
          />
        )}

        {/* Text Feedback - Optional */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Additional Comments (Optional)
          </label>
          <textarea
            name="text"
            value={form.values.text}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder={`Tell us more about your ${activeEntity} experience...`}
            maxLength={maxCharacters}
            rows={4}
            className={`
              w-full px-4 py-3 rounded-lg border transition-colors resize-none
              focus:outline-none focus:ring-2 focus:ring-primary
              ${
                form.errors.text && form.touched.text
                  ? 'border-danger ring-1 ring-danger'
                  : 'border-slate-200'
              }
            `}
            aria-label={`Additional comments about ${activeEntity}`}
          />
          <div className="flex justify-between mt-2">
            <div className="text-xs text-slate-500">
              {characterCount}/{maxCharacters} characters
            </div>
            {characterCount > maxCharacters * 0.9 && (
              <div className="text-xs text-warning">
                Character limit approaching
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || form.isSubmitting || enabledEntities.findIndex((e) => e.key === activeEntity) !== enabledEntities.length - 1} // Ensure all steps are completed
            className="py-3 px-6 rounded-lg border border-slate-200 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {form.isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

          {enabledEntities.length > 1 && (
            <button
              type="button"
              onClick={() => {
                const currentIndex = enabledEntities.findIndex(
                  (e) => e.key === activeEntity
                );
                if (currentIndex > 0) {
                  setActiveEntity(enabledEntities[currentIndex - 1].key);
                }
              }}
              disabled={
                enabledEntities.findIndex((e) => e.key === activeEntity) === 0
              }
              className="py-3 px-6 rounded-lg border border-slate-200 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
          )}

          {enabledEntities.length > 1 && (
            <button
              type="button"
              onClick={() => {
                const currentIndex = enabledEntities.findIndex(
                  (e) => e.key === activeEntity
                );
                if (currentIndex < enabledEntities.length - 1) {
                  setActiveEntity(enabledEntities[currentIndex + 1].key);
                }
              }}
              disabled={
                enabledEntities.findIndex((e) => e.key === activeEntity) ===
                enabledEntities.length - 1
              }
              className="py-3 px-6 rounded-lg border border-slate-200 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>

        {/* Confidentiality Note */}
        <div className="text-xs text-slate-500 text-center">
          Your feedback is confidential and will only be used to improve our
          services.
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
