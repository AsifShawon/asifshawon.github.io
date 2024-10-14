import React from 'react';
import Image from 'next/image';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Define the project object type
interface Project {
    title: string;
    images: string[];
    description: string;
    githubLink: string;
    siteLink?: {
      url: string;
      type: string;
    };
}

// Modify the component to accept a `project` object
interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const { title, description, images, githubLink, siteLink } = project;

    return (
        <div className="w-full">
            <Card className='border-0 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl'>
                <CardHeader className="p-0">
                    {/* Project Image */}
                    <Image
                        src={images[0]}
                        alt={title}
                        width={800}
                        height={600}
                        className="rounded-[15px] h-72 object-cover"
                    />
                    <CardTitle className="pt-3 pl-3 pb-5 text-xl">{title}</CardTitle>
                    {/* <CardDescription>{description}</CardDescription> */}
                </CardHeader>
                <CardFooter className="flex justify-end gap-4">
                    {/* GitHub Link */}
                    <a href={githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        GitHub
                    </a>
                    
                    {/* Site Link (if available) */}
                    {siteLink ? (
                        <a href={siteLink.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {siteLink.type === 'live' ? 'Live Site' : 'Demo'}
                        </a>
                    ) : (
                        ""
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default ProjectCard;
