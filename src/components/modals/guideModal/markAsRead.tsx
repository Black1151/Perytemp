import React, { useState, useEffect, ChangeEvent } from 'react';
import { Checkbox as ChakraCheckbox, useTheme } from '@chakra-ui/react';

interface MarkAsReadProps {
  /** ID of the business-level guide */
  guideId: string | number;
  /** Customer identifier */
  customerId: string | number;
  /** User identifier */
  userId: string | number;
  /** Existing "read" record ID (undefined if not yet marked) */
  initialRecordId?: number;
  /** Called when a new "read" record is created; passes its ID */
  onMark: (recordId: number) => void;
  /** Called when an existing "read" record is deleted */
  onUnmark: () => void;
}

interface MarkReadPayload {
  /** For DELETE: ID of the read-record row */
  id?: number;
  guideId: string | number;
  customerId: string | number;
  userId: string | number;
}

/**
 * Checkbox that posts to create/delete a guideRead row.
 * Syncs internal state if `initialRecordId` prop changes.
 */
export default function MarkAsRead({
  guideId,
  customerId,
  userId,
  initialRecordId,
  onMark,
  onUnmark,
}: MarkAsReadProps): JSX.Element {
  const theme = useTheme();
  const [recordId, setRecordId] = useState<number | undefined>(initialRecordId);
  const [loading, setLoading] = useState<boolean>(false);
  const isRead = recordId !== undefined;

  // Sync local state when parent prop changes
  useEffect(() => {
    setRecordId(initialRecordId);
  }, [initialRecordId]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setLoading(true);

    if (checked) {
      // Create new read record
      const payload: MarkReadPayload = { guideId, customerId, userId };
      try {
        const res = await fetch('/api/guideRead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const { resource } = await res.json();
        const newId = resource?.id;
        if (newId) {
          setRecordId(newId);
          onMark(newId);
        }
      } catch (err) {
        console.error('Error marking as read:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Delete existing read record
      const payload: MarkReadPayload = { id: recordId, guideId, customerId, userId };
      try {
        await fetch('/api/guideRead', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setRecordId(undefined);
        onUnmark();
      } catch (err) {
        console.error('Error unmarking as read:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ChakraCheckbox
      isChecked={isRead}
      isDisabled={loading}
      onChange={handleChange}
      fontSize={{ base: 'md', md: 'sm' }}
      color={theme.colors.primaryTextColor}
    >
      Mark as read
    </ChakraCheckbox>
  );
}
