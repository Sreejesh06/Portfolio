import React from 'react'
import Link from 'next/link'
import { Github, Linkedin, Twitter } from 'lucide-react'
import Container from './containers'

const Footer = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/Sreejesh06',
      icon: Github
    },
    {
      name: 'Twitter',
      url: 'https://x.com/Sreejesh_2006',
      icon: Twitter
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/sreejesh-/',
      icon: Linkedin
    },
  ]

  return (
    <footer className="w-full bg-neutral-50 dark:bg-neutral-950">
      <Container className="flex flex-col items-center justify-between gap-4 py-2  sm:flex-row border border-neutral-200 dark:border-neutral-800">
        <p className="text-neutral-600 dark:text-neutral-400 text-sm font-custom2 tracking-normal transition-colors duration-300 hover:text-neutral-900 dark:hover:text-neutral-100">
          Built with love by Sreejesh
        </p>
        <div className="flex items-center gap-4 ml-9">
          {socialLinks.map((link) => {
            const IconComponent = link.icon
            return (
              <Link
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 dark:text-neutral-50 opacity-70 hover:opacity-100 transition cursor-pointer "
                title={link.name}
              >
                <IconComponent size={15} />
              </Link>
            )
          })}
        </div>
      </Container>
    </footer>
  )
}

export default Footer;