'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  type ProjectIndexEntry,
  getProjectIndex,
  renameProject,
  duplicateProject,
  deleteProject,
} from '@/lib/projectStorage';
import ProjectCard from './ProjectCard';

export default function RecentDesignsGallery() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectIndexEntry[]>([]);

  // Load projects from localStorage on mount
  useEffect(() => {
    setProjects(getProjectIndex());
  }, []);

  const handleOpen = useCallback((project: ProjectIndexEntry) => {
    // Navigate to editor with project ID in search params
    router.push(`/editor/meta-feed-square?project=${project.id}`);
  }, [router]);

  const handleRename = useCallback((id: string, newName: string) => {
    renameProject(id, newName);
    setProjects(getProjectIndex());
  }, []);

  const handleDuplicate = useCallback((id: string) => {
    duplicateProject(id);
    setProjects(getProjectIndex());
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteProject(id);
    setProjects(getProjectIndex());
  }, []);

  // Don't render if no saved designs
  if (projects.length === 0) return null;

  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{
        fontFamily: 'Manrope, sans-serif',
        fontSize: 20,
        fontWeight: 700,
        color: '#1C1D1F',
        marginBottom: 16,
      }}>
        Recent Designs
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16,
      }}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => handleOpen(project)}
            onRename={handleRename}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </section>
  );
}
