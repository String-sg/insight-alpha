# Gray Colors Audit

## Files Using Gray Colors

### Screen Components
1. **app/explore.tsx**
   - `bg-gray-100` (line 57)

2. **app/index.tsx**
   - `bg-gray-100` (line 54)

3. **app/library.tsx**
   - `bg-gray-100` (line 48)

4. **app/podcast/[id].tsx**
   - `text-gray-600` (line 224, 329, 386, 433)
   - `border-gray-100` (line 297)
   - `text-gray-900` (lines 326, 434)
   - `border-gray-200` (line 364)
   - `bg-gray-50` (line 458)
   - `text-gray-400` (line 461)
   - `bg-gray-200` (line 478)

5. **app/quiz/[id].tsx**
   - `text-gray-900` (lines 256, 269)

### UI Components
6. **components/AnswerFeedback.tsx**
   - `bg-gray-100` (line 39)
   - `border-gray-200` (line 56)

7. **components/AudioPlayer.tsx**
   - `bg-gray-800`, `border-gray-200`, `border-gray-700` (line 106)
   - `text-gray-900` (line 117)
   - `text-gray-600`, `text-gray-400` (line 123)
   - `text-gray-500`, `text-gray-400` (lines 146, 149)
   - `bg-gray-100`, `bg-gray-700` (line 207)
   - `text-gray-700`, `text-gray-300` (line 209)
   - Hex values: `#E5E7EB`, `#6B7280` (lines 139, 166, 196, 224, 236, 90)

8. **components/ChatInput.tsx**
   - `border-gray-200` (line 97)
   - `text-gray-900` (line 120)
   - `bg-gray-100` (line 137)
   - `text-gray-500` (line 142)
   - `bg-gray-300` (line 160)
   - `bg-gray-100` (line 192)
   - `text-gray-600` (line 194)
   - Hex values: `#F9FAFB`, `#9CA3AF`, `#E5E7EB` (lines 107, 117, 177, 91)

9. **components/ChatInterface.tsx**
   - `text-gray-700` (line 111)
   - `text-gray-500` (lines 114, 47, 81)
   - `text-gray-600` (line 44)
   - `border-gray-100` (line 70)
   - `text-gray-900` (line 78)
   - `bg-gray-100` (line 90)
   - Hex value: `#9CA3AF`, `#6B7280` (lines 43, 93)

10. **components/ChatMessage.tsx**
    - `bg-gray-400` (line 101)
    - `text-gray-500` (lines 111, 134)
    - `bg-gray-100` (line 83)
    - `text-gray-900` (line 119)
    - Hex value: `#9CA3AF` (lines 47, 49)

11. **components/EducationalCard.tsx**
    - `border-gray-100` (line 117)

12. **components/MiniPlayer.tsx**
    - `text-gray-900` (line 170)
    - `bg-gray-200` (line 181)

13. **components/NoteEditor.tsx**
    - `bg-gray-100` (line 130)
    - `text-gray-900` (line 153)
    - `text-gray-700` (line 173)
    - `text-gray-600` (line 189)

14. **components/PodcastCard.tsx**
    - `border-gray-200` (line 52)
    - `bg-gray-200` (line 57)
    - `text-gray-900` (line 97)
    - `text-gray-600` (line 105)
    - `text-gray-500` (lines 112, 133)
    - `bg-gray-400` (line 131)

15. **components/QuizCard.tsx**
    - `bg-gray-400` (lines 19, 27)
    - `bg-gray-800` (line 69)
    - `text-gray-600`, `text-gray-300` (line 107)
    - `text-gray-500` (lines 114, 117, 123, 133, 162)
    - `bg-gray-200`, `bg-gray-700` (line 154)

16. **components/QuizQuestion.tsx**
    - `border-gray-200` (line 55)
    - `bg-gray-200` (line 65)

17. **components/SourceSheet.tsx**
    - `bg-gray-100` (line 27)
    - `text-gray-500` (line 41)
    - `text-gray-900` (lines 51, 55)

## Summary of Gray Color Usage

### Background Colors
- `bg-gray-50`: Light backgrounds (forms, empty states)
- `bg-gray-100`: Main screen backgrounds, button backgrounds
- `bg-gray-200`: Progress bars, disabled states, mini player controls
- `bg-gray-300`: Disabled send button
- `bg-gray-400`: Progress indicators, play status
- `bg-gray-700`: Dark mode alternatives
- `bg-gray-800`: Dark mode backgrounds

### Text Colors
- `text-gray-400`: Placeholder text
- `text-gray-500`: Secondary text, metadata, timestamps
- `text-gray-600`: Secondary text, descriptions
- `text-gray-700`: Primary text in light contexts
- `text-gray-900`: Primary text, headings

### Border Colors
- `border-gray-100`: Subtle borders
- `border-gray-200`: Standard borders
- `border-gray-700`: Dark mode borders

### Hex Values Used
- `#F9FAFB`: Very light gray (chat input background)
- `#E5E7EB`: Light gray (slider tracks, animations)
- `#9CA3AF`: Medium gray (placeholders, icons)
- `#6B7280`: Dark gray (icons, controls)

## Recommended Slate Replacements
- gray-50 → slate-50
- gray-100 → slate-100
- gray-200 → slate-200
- gray-300 → slate-300
- gray-400 → slate-400
- gray-500 → slate-500
- gray-600 → slate-600
- gray-700 → slate-700
- gray-800 → slate-800
- gray-900 → slate-900

### Hex Value Replacements
- `#F9FAFB` → `#F8FAFC` (slate-50)
- `#E5E7EB` → `#E2E8F0` (slate-200)
- `#9CA3AF` → `#94A3B8` (slate-400)
- `#6B7280` → `#64748B` (slate-500)