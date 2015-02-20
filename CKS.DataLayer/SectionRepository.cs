using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Linq;
using CKS.Contracts;
using CKS.DataLayer.Injections;
using CKS.Entities;
using Omu.ValueInjecter;

namespace CKS.DataLayer
{
    public class SectionRepository : EntityRepository<Section>, ISectionRepository
    {
        private readonly IRepository<Adjustment> _adjustmentRepository;
        private readonly IRepository<Wall> _wallRepository;
        public SectionRepository(DbContext context): base(context)
        {
            _adjustmentRepository = new EntityRepository<Adjustment>(context);
            _wallRepository = new EntityRepository<Wall>(context);
        }

        public void AttachWalls(Section section, ICollection<Wall> walls)
        {
            if (section == null)
                throw new ArgumentNullException("section");
            if (walls == null)
                throw new ArgumentNullException("walls");
            //section does not have walls in database
            if (section.Walls == null || !section.Walls.Any())
            {
                section.Walls = new Collection<Wall>(walls.ToList());
                foreach (var wall in section.Walls)
                {
                    _wallRepository.InsertOrUpdate(wall);
                }
            }
            else
            {
                //new list to avoid modified items in the enumerator
                var databaseWalls = new Collection<Wall>(section.Walls.ToList());
                using (var databaseEnumerator = databaseWalls.GetEnumerator())
                using (var requestEnumerator = walls.GetEnumerator())
                {
                    while (requestEnumerator.MoveNext())
                    {
                        if (databaseEnumerator.MoveNext())
                        {
                            databaseEnumerator.Current.InjectFrom<RequestToDatabase>(requestEnumerator.Current);
                            _wallRepository.Update(databaseEnumerator.Current);
                        }
                        else
                        {
                            requestEnumerator.Current.Section = section;
                            _wallRepository.Add(requestEnumerator.Current);
                        }

                    }
                    while (databaseEnumerator.MoveNext())
                    {
                        _wallRepository.Delete(databaseEnumerator.Current);
                    }
                }                
            }

        }

        public void AttachAdjustments(Section section, ICollection<Adjustment> adjustments)
        {
            if (section == null)
                throw new ArgumentNullException("section");
            if (adjustments == null)
                throw new ArgumentNullException("adjustments");

            //section does not have walls in database
            if (section.Adjustments == null || !section.Adjustments.Any())
            {
                section.Adjustments = new Collection<Adjustment>(adjustments.ToList());
                foreach (var adjustment in section.Adjustments)
                {
                    _adjustmentRepository.InsertOrUpdate(adjustment);
                }
            }
            else
            {
                //new list to avoid modified items in the enumerator
                var databaseAdjustments = new Collection<Adjustment>(section.Adjustments.ToList());
                using (var databaseEnumerator = databaseAdjustments.GetEnumerator())
                using (var requestEnumerator = adjustments.GetEnumerator())
                {
                    while (requestEnumerator.MoveNext())
                    {
                        if (databaseEnumerator.MoveNext())
                        {
                            databaseEnumerator.Current.InjectFrom<RequestToDatabase>(requestEnumerator.Current);
                            _adjustmentRepository.Update(databaseEnumerator.Current);
                        }
                        else
                        {
                            requestEnumerator.Current.Section = section;
                            _adjustmentRepository.Add(requestEnumerator.Current);
                        }

                    }
                    while (databaseEnumerator.MoveNext())
                    {
                        _adjustmentRepository.Delete(databaseEnumerator.Current);
                    }
                }
            }
        }
    }
}
