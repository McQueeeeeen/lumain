import { ProjectRepository } from "@/infrastructure/repositories/project-repository";
import { formatCurrency } from "@/domain/services/pricing-service";
import { Project } from "@/domain/entities";
import Link from "next/link";
import { Plus, Folder, Calendar, User, ArrowRight } from "lucide-react";

export default async function ProjectsPage() {
  const projectRepo = new ProjectRepository();
  // In a real app, we'd get the current user's ID
  const projects: Project[] = []; // await projectRepo.getProjectsByOwner("..."); 

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#A66A3F]">Management</div>
          <h1 className="mt-2 font-display text-5xl font-semibold text-[#2D251E]">Мои Проекты</h1>
        </div>
        <button className="flex items-center gap-2 rounded-[2px] bg-[#2D251E] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#1A1612]">
          <Plus size={18} />
          Создать проект
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2px] border border-dashed border-[rgba(166,106,63,0.18)] bg-[#FAF9F5] p-20 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#A66A3F] shadow-sm">
            <Folder size={32} />
          </div>
          <h2 className="text-xl font-medium text-[#2D251E]">У вас пока нет активных проектов</h2>
          <p className="mt-2 text-[#766A5F]">Создайте свой первый проект освещения, чтобы сформировать КП для клиента.</p>
          <button className="mt-8 text-sm font-bold uppercase tracking-widest text-[#A66A3F] hover:underline">
            Инструкция по работе
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <Link 
              href={`/project/${project.id}`} 
              key={project.id}
              className="group relative block overflow-hidden rounded-[2px] border border-[rgba(166,106,63,0.12)] bg-white p-6 transition-all hover:border-[#A66A3F] hover:shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className={`rounded-[2px] px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  project.status === 'completed' ? 'bg-[#059669] text-white' : 'bg-[#F1ECE4] text-[#766A5F]'
                }`}>
                  {project.status}
                </span>
                <Calendar size={14} className="text-[#A66A3F]/40" />
              </div>
              
              <h3 className="font-display text-xl font-semibold text-[#2D251E] group-hover:text-[#A66A3F]">
                {project.clientName}
              </h3>
              
              <div className="mt-4 space-y-2 text-sm text-[#766A5F]">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span>Менеджер: {project.managerName}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[rgba(166,106,63,0.08)] pt-4">
                <div className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">Детали</div>
                <ArrowRight size={16} className="translate-x-0 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
