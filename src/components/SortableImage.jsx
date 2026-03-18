import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableImage = ({ id, src, onRemove, isNew }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition,
    zIndex: transform ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-brand-muted shadow-sm cursor-grab active:cursor-grabbing bg-white">
      <img src={src} className="w-full h-full object-cover" alt="Gallery" />
      
      {isNew && (
        <div className="absolute top-2 left-2 bg-brand-primary text-crema text-[9px] font-black uppercase px-2 py-1 rounded shadow-md tracking-widest">
          Nueva
        </div>
      )}

      <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
        <button 
          type="button" 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onRemove(id)} 
          className="bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600 transition-transform transform hover:scale-110 shadow-lg cursor-pointer"
        >
          <FiTrash2 size={16}/>
        </button>
      </div>
    </div>
  );
};