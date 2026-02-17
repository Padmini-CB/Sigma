'use client';

import { useEffect, useState } from 'react';

// Types matching _manifest.json structure
interface Expression {
  id: string;
  label: string;
  file: string;
}

interface Person {
  id: string;
  name: string;
  role: string;
  portrait: string;
  expressions: Expression[];
}

interface Manifest {
  version: number;
  people: Person[];
  expressionTypes: string[];
}

export interface FounderPlacement {
  key: string;
  name: string;
  image: string;
  position: 'left' | 'right' | 'bottom';
  size?: number;
}

interface ExpressionLibraryProps {
  onSelect: (placement: FounderPlacement | null) => void;
  selected?: FounderPlacement | null;
}

const ASSET_BASE = '/assets/founders';

function toTitleCase(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, c => c.toUpperCase());
}

export default function ExpressionLibrary({ onSelect, selected }: ExpressionLibraryProps) {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState(false);
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    fetch(`${ASSET_BASE}/_manifest.json`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load manifest');
        return r.json();
      })
      .then((data: Manifest) => setManifest(data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div style={{ padding: 16, textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Kanit', sans-serif",
          fontSize: 13,
          color: 'rgba(255,255,255,0.35)',
        }}>
          No expressions added yet
        </p>
        <p style={{
          fontFamily: "'Kanit', sans-serif",
          fontSize: 11,
          color: 'rgba(255,255,255,0.2)',
          marginTop: 6,
        }}>
          Add -new-nobg.png files to public/assets/founders/
        </p>
      </div>
    );
  }

  if (!manifest) {
    return (
      <div style={{ padding: 16, textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Kanit', sans-serif",
          fontSize: 13,
          color: 'rgba(255,255,255,0.35)',
        }}>
          Loading expressions...
        </p>
      </div>
    );
  }

  // Collect all expression types that actually exist in the data
  const availableTypes = new Set<string>();
  manifest.people.forEach(p =>
    p.expressions.forEach(e => availableTypes.add(e.id))
  );

  const filterTags = ['all', ...manifest.expressionTypes.filter(t => availableTypes.has(t))];

  const handleExpressionClick = (person: Person, expression: Expression) => {
    const imagePath = `${ASSET_BASE}/${expression.file}`;
    const isAlreadySelected = selected?.image === imagePath;

    if (isAlreadySelected) {
      onSelect(null);
    } else {
      onSelect({
        key: person.id,
        name: person.name,
        image: imagePath,
        position: 'right',
        size: 350,
      });
    }
  };

  const handlePortraitClick = (person: Person) => {
    const imagePath = `${ASSET_BASE}/${person.portrait}`;
    const isAlreadySelected = selected?.image === imagePath;

    if (isAlreadySelected) {
      onSelect(null);
    } else {
      onSelect({
        key: person.id,
        name: person.name,
        image: imagePath,
        position: 'right',
        size: 350,
      });
    }
  };

  return (
    <div>
      {/* Section header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path
            d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
            fill="#3B82F6"
          />
        </svg>
        <span style={{
          fontFamily: "'Saira Condensed', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: '#3B82F6',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.06em',
        }}>
          People
        </span>
      </div>

      {/* Filter bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: 4,
        marginBottom: 14,
      }}>
        {filterTags.map(tag => {
          const isActive = activeFilter === tag;
          return (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              style={{
                fontFamily: "'Kanit', sans-serif",
                fontSize: 11,
                fontWeight: 500,
                padding: '3px 10px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                backgroundColor: isActive ? '#3B82F6' : 'rgba(255,255,255,0.06)',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
              }}
            >
              {tag === 'all' ? 'All' : toTitleCase(tag)}
            </button>
          );
        })}
      </div>

      {/* People rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {manifest.people.map(person => {
          const isExpanded = expandedPerson === person.id;
          const isPersonSelected = selected?.key === person.id;
          const filteredExpressions = activeFilter === 'all'
            ? person.expressions
            : person.expressions.filter(e => e.id === activeFilter);
          const hasExpressions = filteredExpressions.length > 0;

          return (
            <div key={person.id}>
              {/* Collapsed row */}
              <button
                onClick={() => {
                  if (person.expressions.length === 0) {
                    handlePortraitClick(person);
                  } else {
                    setExpandedPerson(isExpanded ? null : person.id);
                  }
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: `1px solid ${isPersonSelected ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  backgroundColor: isPersonSelected ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'left' as const,
                }}
              >
                {/* Portrait thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${ASSET_BASE}/${person.portrait}`}
                  alt={person.name}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                    border: isPersonSelected ? '2px solid #3B82F6' : '2px solid rgba(255,255,255,0.1)',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Kanit', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: isPersonSelected ? '#3B82F6' : 'rgba(255,255,255,0.9)',
                    lineHeight: 1.3,
                  }}>
                    {person.name}
                  </div>
                  <div style={{
                    fontFamily: "'Kanit', sans-serif",
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.3,
                  }}>
                    {person.role}
                  </div>
                </div>
                {person.expressions.length > 0 && (
                  <>
                    <span style={{
                      fontFamily: "'Kanit', sans-serif",
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.3)',
                    }}>
                      {person.expressions.length}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{
                        flexShrink: 0,
                        transition: 'transform 0.2s',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      <path
                        d="M19 9l-7 7-7-7"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>

              {/* Expanded expression grid */}
              {isExpanded && (
                <div style={{ padding: '8px 4px 4px' }}>
                  {!hasExpressions ? (
                    <p style={{
                      fontFamily: "'Kanit', sans-serif",
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.3)',
                      textAlign: 'center',
                      padding: '8px 0',
                    }}>
                      No matches for this filter
                    </p>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 6,
                    }}>
                      {filteredExpressions.map(expression => {
                        const imagePath = `${ASSET_BASE}/${expression.file}`;
                        const isThisSelected = selected?.image === imagePath;

                        return (
                          <button
                            key={expression.id}
                            onClick={() => handleExpressionClick(person, expression)}
                            style={{
                              position: 'relative',
                              borderRadius: 8,
                              overflow: 'hidden',
                              border: isThisSelected
                                ? '2px solid #3B82F6'
                                : '1px solid rgba(255,255,255,0.08)',
                              backgroundColor: 'rgba(255,255,255,0.03)',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              aspectRatio: '1',
                              padding: 0,
                              boxShadow: isThisSelected ? '0 0 12px rgba(59,130,246,0.3)' : 'none',
                            }}
                            onMouseEnter={e => {
                              if (!isThisSelected) {
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.4)';
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 8px rgba(59,130,246,0.15)';
                              }
                            }}
                            onMouseLeave={e => {
                              if (!isThisSelected) {
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                              }
                            }}
                            title={expression.label}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imagePath}
                              alt={`${person.name} - ${expression.label}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            {/* Label overlay */}
                            <span style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              padding: '3px 4px',
                              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                              fontFamily: "'Kanit', sans-serif",
                              fontSize: 9,
                              fontWeight: 400,
                              color: 'rgba(255,255,255,0.8)',
                              textAlign: 'center',
                              lineHeight: 1.3,
                            }}>
                              {expression.label}
                            </span>
                            {/* Selected checkmark */}
                            {isThisSelected && (
                              <div style={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                backgroundColor: '#3B82F6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M20 6L9 17l-5-5"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Position selector when person is selected */}
                  {isPersonSelected && selected && (
                    <div style={{ marginTop: 10, padding: '0 2px' }}>
                      <div style={{
                        fontFamily: "'Kanit', sans-serif",
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.4)',
                        marginBottom: 6,
                      }}>
                        Position
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {(['left', 'right', 'bottom'] as const).map(pos => (
                          <button
                            key={pos}
                            onClick={() => onSelect({ ...selected, position: pos })}
                            style={{
                              fontFamily: "'Kanit', sans-serif",
                              fontSize: 11,
                              fontWeight: 500,
                              padding: '4px 12px',
                              borderRadius: 4,
                              border: 'none',
                              cursor: 'pointer',
                              textTransform: 'capitalize' as const,
                              transition: 'all 0.15s',
                              backgroundColor: selected.position === pos ? '#3B82F6' : 'rgba(255,255,255,0.06)',
                              color: selected.position === pos ? '#ffffff' : 'rgba(255,255,255,0.5)',
                            }}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
