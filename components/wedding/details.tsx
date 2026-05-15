"use client"

import { MapPin, Clock, Shirt, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const details = [
  {
    icon: MapPin,
    title: "Ceremony",
    content: [
      "Chapel of San Pedro Calungsod",
      "SM Seaside Complex",
      "Cebu City, Philippines",
    ],
  },
  {
    icon: MapPin,
    title: "Reception",
    content: [
      "Marco Polo Plaza Cebu",
      "Nivel Hills, Cebu City",
      "6000 Cebu, Philippines",
    ],
  },
  {
    icon: Clock,
    title: "Schedule",
    content: [
      "Ceremony: 3:00 PM",
      "Cocktail Hour: 4:30 PM",
      "Reception: 6:00 PM",
    ],
  },
  {
    icon: Shirt,
    title: "Dress Code",
    content: [
      "Modern Filipiniana",
      "Ladies: Formal Gowns",
      "Gentlemen: Barong Tagalog / Suits",
    ],
  },
  {
    icon: Mail,
    title: "Contact",
    content: [
      "Questions? Reach out to us:",
      "wedding@johnmarkandchezza.com",
    ],
  },
]

export function Details() {
  return (
    <section id="details" className="py-24 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="text-sm tracking-[0.3em] uppercase font-(family-name:--font-montserrat) text-muted-foreground mb-4">
            The Celebration
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Wedding Details
          </h2>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {details.map((detail) => (
            <Card
              key={detail.title}
              className="bg-card border-none shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                    <detail.icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-4">
                    {detail.title}
                  </h3>
                </div>
                <div className="space-y-1">
                  {detail.content.map((line, index) => {
                    const isEmail = line.includes("@") && line.includes(".");
                    return (
                      <p
                        key={index}
                        className={`text-sm text-muted-foreground font-(family-name:--font-montserrat) ${
                          isEmail ? "break-all hover:text-accent transition-colors" : ""
                        }`}
                      >
                        {isEmail ? (
                          <a href={`mailto:${line}`} className="underline decoration-accent/30 underline-offset-4">
                            {line}
                          </a>
                        ) : (
                          line
                        )}
                      </p>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map Section */}
        <div className="mt-16 md:mt-24 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-light mb-4 text-foreground">Locations</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ceremony Map */}
            <div className="space-y-4">
              <h4 className="text-center text-lg font-medium text-foreground">Ceremony</h4>
              <div className="aspect-video rounded-3xl overflow-hidden bg-muted shadow-sm border border-border/50">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.864778107954!2d123.87834787502446!3d10.27851608985141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99b4566d87e07%3A0x633d98031e13b860!2sChapel%20of%20San%20Pedro%20Calungsod!5e0!3m2!1sen!2sph!4v1715785200000!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ceremony Location: Chapel of San Pedro Calungsod"
                />
              </div>
              <p className="text-center text-xs text-muted-foreground font-(family-name:--font-montserrat)">
                Chapel of San Pedro Calungsod, SM Seaside Complex
              </p>
            </div>

            {/* Reception Map */}
            <div className="space-y-4">
              <h4 className="text-center text-lg font-medium text-foreground">Reception</h4>
              <div className="aspect-video rounded-3xl overflow-hidden bg-muted shadow-sm border border-border/50">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.3674681605335!2d123.89679657478652!3d10.334645289766952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a999741e57147b%3A0x6e788c03973c7340!2sMarco%20Polo%20Plaza%20Cebu!5e0!3m2!1sen!2sph!4v1715777777777!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Reception Location: Marco Polo Plaza Cebu"
                />
              </div>
              <p className="text-center text-xs text-muted-foreground font-(family-name:--font-montserrat)">
                Marco Polo Plaza Cebu, Nivel Hills
              </p>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-12 font-(family-name:--font-montserrat)">
            Click on the maps to get directions for your travel.
          </p>
        </div>
      </div>
    </section>
  )
}
